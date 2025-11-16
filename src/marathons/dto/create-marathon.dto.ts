import { IsDateString, IsIn, IsNotEmpty, MaxLength } from 'class-validator';
// ⬇ було: import { MarathonStatus } from '../marathon.entity';
import type { MarathonStatus } from '../marathon.entity';

export class CreateMarathonDto {
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  content: string; // HTML from CKEditor

  @IsDateString()
  timeStart: string;

  @IsDateString()
  timeEnd: string;

  @IsIn(['announced', 'active', 'archived'])
  status: MarathonStatus;
}
