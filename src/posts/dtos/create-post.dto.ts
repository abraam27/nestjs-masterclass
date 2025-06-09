import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import { Type } from 'class-transformer';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(512)
  title: string;

  @ApiProperty({
    enum: PostType,
    description:
      'The type of the post and options are: post, page, story, series',
    example: 'post',
  })
  @IsNotEmpty()
  @IsEnum(PostType)
  postType: PostType;

  @ApiProperty({
    description: 'The slug of the post',
    example: 'my-first-post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: PostStatus,
    description:
      'The status of the post and options are: draft, scheduled, review, published',
    example: 'draft',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiPropertyOptional({
    description: 'The content of the post',
    example: 'My First Post Content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'The schema of the post',
    example: '{"@context": "https://schema.org", "@type": "Person"}',
  })
  @IsString()
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'The featured image url of the post',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The published on date of the post',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn?: Date;

  @ApiPropertyOptional({
    description: 'The tags of the post',
    example: ['tag1', 'tag2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'The key of the meta option',
          example: 'sidebarEnabled',
        },
        value: {
          type: 'any',
          description: 'The value of the meta option',
          example: true,
        },
      },
    },
    description: 'The meta options of the post',
    example: [
      {
        key: ' sidebarEnabled',
        value: true,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
