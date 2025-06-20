import { IsString, IsNotEmpty, IsEnum, IsMongoId } from 'class-validator';
import { OptionType } from '../option.schema';

export class CreateOptionDto {
  @IsEnum(OptionType)
  type: OptionType;

  @IsMongoId()
  @IsNotEmpty()
  test: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
