import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Test, TestType, TestDegree } from './test.schema';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Option } from '../option/option.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<Test>,
    @InjectModel(Option.name) private optionModel: Model<Option>,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    // 1. Avval test yaratamiz (options va correctOptionId siz)
    const test = new this.testModel({
      subject: createTestDto.subject,
      question: createTestDto.question,
      target: createTestDto.target,
      type: createTestDto.type,
      degree: createTestDto.degree,
    });

    await test.save();

    // 2. Options'larni test _id bilan yaratamiz
    const optionPromises = createTestDto.options.map(async (opt) => {
      const option = new this.optionModel({
        type: opt.type,
        value: opt.value,
      });
      return await option.save();
    });
    const createdOptions = await Promise.all(optionPromises);
    const optionIds = createdOptions.map((opt) => opt._id);

    // 3. To'g'ri option'ni topamiz
    const correctOption = createdOptions.find(
      (opt) => opt.value === createTestDto.correctOptionValue,
    );

    if (!correctOption) {
      throw new Error('Correct option not found among the provided options');
    }

    // 4. Test'ni options va correctOptionId bilan yangilaymiz
    test.options = optionIds as Types.ObjectId[];
    test.correctOptionId = new Types.ObjectId(correctOption._id.toString());
    await test.save();

    return this.findOne(test._id.toString());
  }

  async findAll(): Promise<Test[]> {
    return this.testModel
      .find()
      .populate('subject', 'name')
      .populate('options', 'type value')
      .exec();
  }

  async findOne(id: string): Promise<Test> {
    const test = await this.testModel
      .findById(id)
      .populate('subject', 'name')
      .populate('options', 'type value')
      .exec();
    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }
    return test;
  }

  async findBySubject(subjectId: string): Promise<Test[]> {
    return this.testModel
      .find({ subject: subjectId })
      .populate('subject', 'name')
      .populate('options', 'type value')
      .exec();
  }

  async update(id: string, updateTestDto: UpdateTestDto): Promise<Test> {
    const test = await this.testModel.findById(id);
    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    // Store old values for file deletion logic
    const oldType = test.type;
    const oldTarget = test.target;
    const oldOptions = test.options;

    // Update basic test fields
    if (updateTestDto.subject) {
      test.subject = new Types.ObjectId(updateTestDto.subject);
    }
    if (updateTestDto.question) {
      test.question = updateTestDto.question;
    }
    if (updateTestDto.target !== undefined) {
      test.target = updateTestDto.target;
    }
    if (updateTestDto.type) {
      test.type = updateTestDto.type;
    }
    if (updateTestDto.degree !== undefined) {
      test.degree = updateTestDto.degree;
    }

    // Handle file deletion logic for question/target
    if (oldType === TestType.FILE && test.type !== TestType.FILE) {
      // If changing from file type to another type, delete the old file
      if (oldTarget && oldTarget.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), oldTarget);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error('Error deleting old target file:', error);
        }
      }
    } else if (
      oldType === TestType.FILE &&
      test.type === TestType.FILE &&
      updateTestDto.target
    ) {
      // If staying as file type but target is being updated, delete the old file
      if (
        oldTarget &&
        oldTarget !== updateTestDto.target &&
        oldTarget.startsWith('/uploads/')
      ) {
        const filePath = path.join(process.cwd(), oldTarget);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error('Error deleting old target file:', error);
        }
      }
    }

    // Handle options update if provided
    if (updateTestDto.options) {
      // Get existing options to check for file deletions
      const existingOptions = await this.optionModel.find({
        _id: { $in: oldOptions },
      });

      // Delete old option files before creating new options
      for (const option of existingOptions) {
        if (option.value && option.value.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), option.value);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (error) {
            console.error('Error deleting old option file:', error);
          }
        }
      }

      // Delete existing options using the test's options array
      if (oldOptions && oldOptions.length > 0) {
        await this.optionModel.deleteMany({ _id: { $in: oldOptions } }).exec();
      }

      // Create new options
      const optionPromises = updateTestDto.options.map(async (optionData) => {
        const option = new this.optionModel({
          type: optionData.type,
          value: optionData.value,
        });
        return option.save();
      });

      const createdOptions = await Promise.all(optionPromises);
      const optionIds = createdOptions.map(
        (option) => option._id,
      ) as Types.ObjectId[];

      // Find and set the correct option
      if (updateTestDto.correctOptionValue) {
        const correctOption = createdOptions.find(
          (option) => option.value === updateTestDto.correctOptionValue,
        );
        if (!correctOption) {
          throw new Error(
            'Correct option not found among the provided options',
          );
        }
        test.correctOptionId = correctOption._id as Types.ObjectId;
      } else {
        // If no correctOptionValue provided, set the first option as correct (fallback)
        test.correctOptionId = createdOptions[0]._id as Types.ObjectId;
      }

      test.options = optionIds;
    }

    await test.save();
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    // Get the test first to access its options and target
    const test = await this.testModel.findById(id);
    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    // Delete target file if it exists and is a file path
    if (test.target && test.target.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), test.target);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Error deleting target file:', error);
      }
    }

    // Delete all options related to this test using the options array
    if (test.options && test.options.length > 0) {
      // Get option details to delete their files
      const options = await this.optionModel.find({
        _id: { $in: test.options },
      });

      // Delete option files
      for (const option of options) {
        if (option.value && option.value.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), option.value);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (error) {
            console.error('Error deleting option file:', error);
          }
        }
      }

      await this.optionModel.deleteMany({ _id: { $in: test.options } }).exec();
    }

    // Delete the test
    await this.testModel.findByIdAndDelete(id).exec();
  }
}
