import {} from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The ID of the post to update',
    example: '1234',
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;
}
