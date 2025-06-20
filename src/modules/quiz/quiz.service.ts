import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz, QuizDocument } from './quiz.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Test } from '../test/test.schema';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(Test.name) private testModel: Model<Test>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const createdQuiz = new this.quizModel(createQuizDto);
    return createdQuiz.save();
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findOne(id: string): Promise<Quiz> {
    return this.quizModel.findById(id).exec();
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    return this.quizModel
      .findByIdAndUpdate(id, updateQuizDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Quiz> {
    return this.quizModel.findByIdAndDelete(id).exec();
  }

  async saveResult(dto: CreateQuizDto, userId: Types.ObjectId) {
    // Helper to count correct answers for a subject
    const countCorrectAnswers = async (
      subjectId: Types.ObjectId,
      userAnswers: Types.ObjectId[],
    ) => {
      const questions = await this.testModel.find({ subject: subjectId });
      let correct = 0;
      questions.forEach((q, idx) => {
        if (
          userAnswers[idx] &&
          q.correctOptionId &&
          userAnswers[idx].toString() === q.correctOptionId.toString()
        ) {
          correct++;
        }
      });
      return correct;
    };

    // Main
    let mainResult = null;
    if (dto.main && dto.main.subject && Array.isArray(dto.main.answers)) {
      const correctAnswers = await countCorrectAnswers(
        dto.main.subject,
        dto.main.answers,
      );
      mainResult = {
        subject: dto.main.subject,
        correctAnswers,
        score: correctAnswers * 3.1,
      };
    }

    // Addition
    let additionResult = null;
    if (
      dto.addition &&
      dto.addition.subject &&
      Array.isArray(dto.addition.answers)
    ) {
      const correctAnswers = await countCorrectAnswers(
        dto.addition.subject,
        dto.addition.answers,
      );
      additionResult = {
        subject: dto.addition.subject,
        correctAnswers,
        score: correctAnswers * 2.1,
      };
    }

    // Mandatory
    const mandatoryResults = [];
    if (Array.isArray(dto.mandatory)) {
      for (const item of dto.mandatory) {
        if (item && item.subject && Array.isArray(item.answers)) {
          const correctAnswers = await countCorrectAnswers(
            item.subject,
            item.answers,
          );
          mandatoryResults.push({
            subject: item.subject,
            correctAnswers,
            score: correctAnswers * 1.1,
          });
        }
      }
    }

    // totalScore hisoblash
    const totalScore =
      (mainResult?.score || 0) +
      (additionResult?.score || 0) +
      (mandatoryResults.reduce((sum, item) => sum + (item.score || 0), 0) || 0);

    const quizToSave = {
      user: userId,
      block: dto.block,
      main: mainResult,
      addition: additionResult,
      mandatory: mandatoryResults,
      totalScore,
    };

    const createdQuiz = new this.quizModel(quizToSave);
    const savedQuiz = await createdQuiz.save();

    // Remove blockId from user's accessible_blocks
    if (userId && dto.block) {
      await this.userModel.updateOne(
        { _id: userId },
        { $pull: { accessible_blocks: dto.block } },
      );
    }

    return savedQuiz;
  }

  async getQuizResults(
    period: 'daily' | 'weekly' | 'monthly',
    page = 1,
    limit = 10,
    userId: string,
  ) {
    const today = new Date();
    const startDate = new Date();

    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(today.getMonth() - 1);
        break;
    }

    const skip = (page - 1) * limit;

    const query: any = {
      createdAt: { $gte: startDate, $lte: today },
    };
    query.user = new Types.ObjectId(userId);

    const [results, total] = await Promise.all([
      this.quizModel
        .find(query)
        .sort({ totalScore: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'full_name')
        .populate('block', 'name')
        .populate('main.subject', 'name')
        .populate('addition.subject', 'name')
        .populate('mandatory.subject', 'name')
        .exec(),
      this.quizModel.countDocuments(query),
    ]);

    return {
      results,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async getQuizRatings(
    period: 'daily' | 'weekly' | 'monthly' | 'all',
    page = 1,
    limit = 10,
    blockName?: string,
  ) {
    const numPage = Number(page);
    const numLimit = Number(limit);

    const today = new Date();
    let startDate: Date | null = new Date();

    if (period === 'all') {
      startDate = null;
    } else {
      switch (period) {
        case 'daily':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(today.getMonth() - 1);
          break;
      }
    }

    const initialMatch = startDate
      ? { createdAt: { $gte: startDate, $lte: today } }
      : {};

    const skip = (numPage - 1) * numLimit;

    const aggregationPipeline: any[] = [{ $match: initialMatch }];

    if (blockName) {
      aggregationPipeline.push(
        {
          $lookup: {
            from: 'blocks',
            let: { blockId: '$block' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', { $toObjectId: '$$blockId' }],
                  },
                  name: { $regex: blockName, $options: 'i' },
                },
              },
            ],
            as: 'blockInfo',
          },
        },
        { $match: { blockInfo: { $ne: [] } } },
        { $unwind: '$blockInfo' },
      );
    }

    aggregationPipeline.push(
      { $sort: { totalScore: -1, createdAt: -1 } },
      {
        $group: {
          _id: '$user',
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sort: { totalScore: -1 } },
      {
        $facet: {
          paginatedResults: [{ $skip: skip }, { $limit: numLimit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    );

    const [aggregatedData] =
      await this.quizModel.aggregate(aggregationPipeline);

    const results = aggregatedData.paginatedResults;
    const total = aggregatedData.totalCount[0]?.count || 0;

    await this.quizModel.populate(results, [
      { path: 'user', select: 'full_name' },
      { path: 'block', select: 'name' },
      { path: 'main.subject', select: 'name' },
      { path: 'addition.subject', select: 'name' },
      { path: 'mandatory.subject', select: 'name' },
    ]);

    return {
      results,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async getAllTimeTopResults(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.quizModel
        .find()
        .sort({ totalScore: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'full_name')
        .populate('block', 'name')
        .populate('main.subject', 'name')
        .populate('addition.subject', 'name')
        .populate('mandatory.subject', 'name')
        .exec(),
      this.quizModel.countDocuments(),
    ]);

    return {
      results,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }
}
