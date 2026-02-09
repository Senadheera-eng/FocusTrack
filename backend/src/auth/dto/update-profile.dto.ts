import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Username must be at most 50 characters' })
  username?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
