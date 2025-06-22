import { Controller, Post, Body } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreateMetaOptionsDto } from './dtos/create-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  public async createMetaOption(
    @Body() createMetaOptionsDto: CreateMetaOptionsDto,
  ) {
    return await this.metaOptionsService.createMetaOption(createMetaOptionsDto);
  }
}
