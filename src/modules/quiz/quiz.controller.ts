import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { join } from 'path';
import { Response } from 'express';

@Controller('quiz')
@UseGuards(AuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Post('result')
  saveResult(@Body() dto: CreateQuizDto, @Request() req) {
    return this.quizService.saveResult(dto, req.user._id);
  }

  @Get('results')
  async getAllTimeResults(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.quizService.getAllTimeTopResults(page, limit);
  }

  @Get('results/:period')
  async getResults(
    @Param('period') period: 'daily' | 'weekly' | 'monthly',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Request() req,
  ) {
    const user = req.user;
    return this.quizService.getQuizResults(period, page, limit, user._id);
  }

  @Get('ratings/:period')
  async getUserRatings(
    @Param('period') period: 'daily' | 'weekly' | 'monthly' | 'all',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Request() req,
  ) {
    const user = req.user;
    return this.quizService.getUserQuizRatings(period, page, limit, user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }

  @Get('uploads/:filename')
  async getUploadedFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads', filename);
    return res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({
          message: 'Fayl topilmadi',
          error: 'Not Found',
          statusCode: 404,
        });
      }
    });
  }
}
