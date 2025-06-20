import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { Subject, SubjectSchema } from './subject.schema';
import { Test, TestSchema } from '../test/test.schema';
import { Option, OptionSchema } from '../option/option.schema';
import { AuthModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subject.name, schema: SubjectSchema },
      { name: Test.name, schema: TestSchema },
      { name: Option.name, schema: OptionSchema },
    ]),
    AuthModule,
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
