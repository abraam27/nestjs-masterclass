import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(10)
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(20)
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password?: string;
}
