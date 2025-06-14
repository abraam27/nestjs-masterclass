import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { Repository } from 'typeorm';

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
}
