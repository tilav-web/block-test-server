import { Types } from 'mongoose';
import { IsMongoId, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class SubjectAnswerDto {
  @IsMongoId()
  subject: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  answers: Types.ObjectId[];
}

export class CreateQuizDto {
  @IsMongoId()
  user: Types.ObjectId;

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
