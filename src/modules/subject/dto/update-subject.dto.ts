import { IsString, IsOptional } from 'class-validator';

export class UpdateSubjectDto {
  @IsString()
  @IsOptional()
  name?: string;
}
