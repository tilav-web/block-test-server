import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Option } from './option.schema';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionService {
  constructor(
    @InjectModel(Option.name) private optionModel: Model<Option>,
  ) {}

  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    const option = new this.optionModel(createOptionDto);
    return option.save();
  }

  async findAll(): Promise<Option[]> {
    return this.optionModel
      .find()
      .populate('test', 'question')
      .exec();
  }

  async findOne(id: string): Promise<Option> {
    const option = await this.optionModel
      .findById(id)
      .populate('test', 'question')
      .exec();
    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    return option;
  }

  async findByTest(testId: string): Promise<Option[]> {
    return this.optionModel
      .find({ test: testId })
      .populate('test', 'question')
      .exec();
  }

  async update(
    id: string,
    updateOptionDto: UpdateOptionDto,
  ): Promise<Option> {
    const option = await this.optionModel
      .findByIdAndUpdate(id, updateOptionDto, { new: true })
      .populate('test', 'question')
      .exec();
    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    return option;
  }

  async remove(id: string): Promise<void> {
    const result = await this.optionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
  }
}
