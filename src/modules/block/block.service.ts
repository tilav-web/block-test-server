import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block } from './block.schema';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { TestService } from '../test/test.service';
import { SubjectService } from '../subject/subject.service';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block.name) private blockModel: Model<Block>,
    private readonly testService: TestService,
    private readonly subjectService: SubjectService,
  ) {}

  async create(createBlockDto: CreateBlockDto): Promise<Block> {
    const block = new this.blockModel(createBlockDto);
    return block.save();
  }

  async findAll(): Promise<Block[]> {
    return this.blockModel
      .find()
      .populate('main')
      .populate('addition')
      .populate('mandatory')
      .exec();
  }

  async findOne(id: string): Promise<Block> {
    const block = await this.blockModel
      .findById(id)
      .populate('main')
      .populate('addition')
      .populate('mandatory')
      .exec();
    if (!block) {
      throw new NotFoundException(`Block with ID ${id} not found`);
    }
    return block;
  }

  async update(id: string, updateBlockDto: UpdateBlockDto): Promise<Block> {
    const block = await this.blockModel
      .findByIdAndUpdate(id, updateBlockDto, { new: true })
      .populate('main')
      .populate('addition')
      .populate('mandatory')
      .exec();
    if (!block) {
      throw new NotFoundException(`Block with ID ${id} not found`);
    }
    return block;
  }

  async remove(id: string): Promise<void> {
    const result = await this.blockModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Block with ID ${id} not found`);
    }
  }

  async getBlockWithTests(blockId: string) {
    const block = await this.blockModel.findById(blockId).exec();
    if (!block) {
      throw new NotFoundException(`Block with ID ${blockId} not found`);
    }

    // Main subject tests
    let mainTests = [];
    let mainName = null;
    if (block.main) {
      mainTests = await this.testService['testModel']
        .find({ subject: block.main, degree: 'hard' })
        .limit(30)
        .populate('subject')
        .populate('options', 'type value')
        .exec();
      const mainSubject = await this.subjectService.findOne(
        block.main.toString(),
      );
      mainName = mainSubject;
    }

    // Addition subject tests
    let additionTests = [];
    let additionName = null;
    if (block.addition) {
      additionTests = await this.testService['testModel']
        .find({ subject: block.addition, degree: 'hard' })
        .limit(30)
        .populate('subject')
        .populate('options', 'type value')
        .exec();
      const additionSubject = await this.subjectService.findOne(
        block.addition.toString(),
      );
      additionName = additionSubject;
    }

    // Mandatory subjects
    const mandatory = [];
    if (block.mandatory && block.mandatory.length > 0) {
      for (const subjectId of block.mandatory) {
        const subject = await this.subjectService.findOne(subjectId.toString());
        const tests = await this.testService['testModel']
          .find({ subject: subjectId, degree: 'easy' })
          .limit(10)
          .populate('subject')
          .populate('options', 'type value')
          .exec();
        mandatory.push({ subject: subject, tests });
      }
    }

    return {
      block,
      main: { subject: mainName, tests: mainTests },
      addition: { subject: additionName, tests: additionTests },
      mandatory,
    };
  }
}
