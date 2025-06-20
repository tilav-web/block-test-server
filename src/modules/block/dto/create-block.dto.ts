import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateBlockDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

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