import {
  IsString,
  IsMongoId,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateBlockDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsMongoId()
  @IsOptional()
  main?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  addition?: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  mandatory?: Types.ObjectId[];
} 