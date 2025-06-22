import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { Repository } from 'typeorm';
import { In } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}
  public async findAll() {
    return await this.tagsRepository.find();
  }

  public async createTag(createTagDto: CreateTagDto) {
    let tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  public async findOneByMultipleIds(ids: number[]) {
    return await this.tagsRepository.find({ where: { id: In(ids) } });
  }

  public async deleteTag(id: number) {
    await this.tagsRepository.delete(id);
    return { deleted: true, id };
  }

  public async softDeleteTag(id: number) {
    await this.tagsRepository.softDelete(id);
    return { deleted: true, id };
  }
}
