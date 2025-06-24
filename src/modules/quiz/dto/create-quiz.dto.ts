import { Types } from 'mongoose';
import { IsMongoId, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerPairDto {
  @IsMongoId()
  questionId: Types.ObjectId;

  @IsMongoId()
  answerId: Types.ObjectId;
}

class SubjectAnswerDto {
  @IsMongoId()
  subject: Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerPairDto)
  answers: AnswerPairDto[];
}

export class CreateQuizDto {
  @IsMongoId()
  block: Types.ObjectId;

  @ValidateNested()
  @Type(() => SubjectAnswerDto)
  main: SubjectAnswerDto;

  @ValidateNested()
  @Type(() => SubjectAnswerDto)
  addition: SubjectAnswerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectAnswerDto)
  mandatory: SubjectAnswerDto[];
}
