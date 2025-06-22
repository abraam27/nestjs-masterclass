import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-options.entity';
import { Repository } from 'typeorm';
import { CreateMetaOptionsDto } from '../dtos/create-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOption(createMetaOptionsDto: CreateMetaOptionsDto) {
    const newMetaOption =
      this.metaOptionsRepository.create(createMetaOptionsDto);
    return await this.metaOptionsRepository.save(newMetaOption);
  }
}
