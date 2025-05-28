import { Type } from "class-transformer";
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class GetUserParamDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}