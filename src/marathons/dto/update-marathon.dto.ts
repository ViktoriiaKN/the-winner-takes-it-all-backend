import { IsDateString, IsIn, IsOptional, MaxLength } from 'class-validator';
// ⬇ теж міняємо на import type
import type { MarathonStatus } from '../marathon.entity';

export class UpdateMarathonDto {
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  content?: string; // HTML from CKEditor

  @IsOptional()
  @IsDateString()
  timeStart?: string;

  @IsOptional()
  @IsDateString()
  timeEnd?: string;

  @IsOptional()
  @IsIn(['announced', 'active', 'archived'])
  status?: MarathonStatus;
}
