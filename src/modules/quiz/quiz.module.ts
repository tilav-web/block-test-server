import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './quiz.schema';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { Test, TestSchema } from '../test/test.schema';
import { AuthModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: Test.name, schema: TestSchema },
    ]),
    AuthModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
