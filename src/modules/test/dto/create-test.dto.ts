import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsMongoId,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TestType, TestDegree } from '../test.schema';
import { OptionType } from '../../option/option.schema';

export class CreateOptionDto {
  @IsEnum(OptionType)
  @IsNotEmpty()
  type: OptionType;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateTestDto {
  @IsMongoId()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsEnum(TestType)
  type: TestType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];

  @IsString()
  @IsNotEmpty()
  correctOptionValue: string;

  @IsEnum(TestDegree)
  @IsOptional()
  degree?: TestDegree;
}
