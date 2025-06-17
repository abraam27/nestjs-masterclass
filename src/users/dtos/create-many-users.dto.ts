import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class CreateManyUserDto {
  @ApiProperty({
    type: [User],
    required: true,
    items: {
      type: 'User',
    },
    example: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateUserDto)
  @ValidateNested({ each: true })
  users: CreateUserDto[];
}
