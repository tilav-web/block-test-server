import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject } from './subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Test } from '../test/test.schema';
import { Option } from '../option/option.schema';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
    @InjectModel(Test.name) private testModel: Model<Test>,
    @InjectModel(Option.name) private optionModel: Model<Option>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new this.subjectModel(createSubjectDto);
    return subject.save();
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().exec();
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findById(id).exec();
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.subjectModel
      .findByIdAndUpdate(id, updateSubjectDto, { new: true })
      .exec();
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async remove(id: string): Promise<void> {
    // Find all tests related to this subject
    const tests = await this.testModel.find({ subject: id }).exec();
    const testIds = tests.map((test) => test._id);

    // Delete all options related to these tests
    if (testIds.length > 0) {
      await this.optionModel.deleteMany({ test: { $in: testIds } }).exec();
    }

    // Delete all tests related to this subject
    await this.testModel.deleteMany({ subject: id }).exec();

    // Finally delete the subject
    const result = await this.subjectModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }
}
