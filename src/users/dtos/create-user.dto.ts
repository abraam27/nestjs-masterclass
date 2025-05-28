import { IsEmail, IsEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmpty()
    @MinLength(3)
    @MaxLength(10)
    firstName: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(10)
    lastName?: string;

    @IsEmpty()
    @IsEmail()
    email: string;

    @IsEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: 'Minimum eight characters, at least one letter, one number and one special character'
    })
    password: string;
}