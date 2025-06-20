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
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AuthGuard } from '../user/guards/auth.guard';

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
  getRatings(
    @Param('period') period: 'daily' | 'weekly' | 'monthly' | 'all',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('blockName') blockName?: string,
  ) {
    return this.quizService.getQuizRatings(period, page, limit, blockName);
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
}
