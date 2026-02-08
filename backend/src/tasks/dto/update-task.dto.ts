import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Title must be less than 200 characters' })
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Description must be less than 1000 characters' })
  description?: string;

  @IsEnum(['todo', 'in_progress', 'done'], { message: 'Status must be todo, in_progress, or done' })
  @IsOptional()
  status?: 'todo' | 'in_progress' | 'done';

  @IsEnum(['low', 'medium', 'high'], { message: 'Priority must be low, medium, or high' })
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';
}