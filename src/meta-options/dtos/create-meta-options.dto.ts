import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsJSON } from 'class-validator';

export class CreateMetaOptionsDto {
  @ApiProperty({
    description: 'The meta value of the meta option',
    example: '{"key": "sidebarEnabled", "value": true}',
  })
  @IsJSON()
  @IsNotEmpty()
  metaValue: string;
}
