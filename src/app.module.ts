import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/user/user.module';
import { SubjectModule } from './modules/subject/subject.module';
import { TestModule } from './modules/test/test.module';
import { OptionModule } from './modules/option/option.module';
import { BlockModule } from './modules/block/block.module';
import { QuizModule } from './modules/quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/blok-test',
    ),
    AuthModule,
    SubjectModule,
    TestModule,
    OptionModule,
    BlockModule,
    QuizModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
