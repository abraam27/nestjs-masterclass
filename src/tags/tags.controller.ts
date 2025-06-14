import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @Post()
    createTag(@Body() createTagDto: CreateTagDto) {
        return this.tagsService.createTag(createTagDto);
    }
}
