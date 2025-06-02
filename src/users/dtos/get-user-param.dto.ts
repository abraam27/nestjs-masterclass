import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class GetUserParamDto {
  @ApiPropertyOptional({
    description: 'Get User with a specific ID',
    example: '1234',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
