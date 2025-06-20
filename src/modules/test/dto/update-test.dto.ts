import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TestType, TestDegree } from '../test.schema';
import { OptionType } from '../../option/option.schema';

export class UpdateOptionDto {
  @IsEnum(OptionType)
  @IsOptional()
  type?: OptionType;

  @IsString()
  @IsOptional()
  value?: string;
}

export class UpdateTestDto {
  @IsMongoId()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsEnum(TestType)
  @IsOptional()
  type?: TestType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  @IsOptional()
  options?: UpdateOptionDto[];

  @IsString()
  @IsOptional()
  correctOptionValue?: string;

  @IsEnum(TestDegree)
  @IsOptional()
  degree?: TestDegree;
}
