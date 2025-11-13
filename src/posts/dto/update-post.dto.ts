import { IsOptional, MaxLength } from 'class-validator';
export class UpdatePostDto {
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  body?: string;
}
