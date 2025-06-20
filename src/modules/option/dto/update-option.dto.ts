import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { OptionType } from '../option.schema';

export class UpdateOptionDto {
  @IsEnum(OptionType)
  @IsOptional()
  type?: OptionType;

  @IsMongoId()
  @IsOptional()
  test?: string;

  @IsString()
  @IsOptional()
  value?: string;
}
