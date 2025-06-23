import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';
import { NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class CreatePostProvider {
    constructor(
        private readonly tagsService: TagsService,
        private readonly usersService: UsersService,
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
    ) { }

    public async createPost(createPostDto: CreatePostDto, authorId: number) {
        try {
            if (!createPostDto.title || !createPostDto.slug) {
                throw new BadRequestException('Title and slug are required');
            }

            if (createPostDto.tags && !Array.isArray(createPostDto.tags)) {
                throw new BadRequestException('Tags must be an array of IDs');
            }

            const tags = await this.tagsService.findOneByMultipleIds(createPostDto.tags);
            if (!tags || tags.length === 0 || tags.length !== createPostDto.tags.length) {
                throw new NotFoundException('No valid tags found');
            }

            const user = await this.usersService.findOneById(authorId);
            if (!user) {
                throw new NotFoundException(`User with ID ${authorId} not found`);
            }

            const existPost = await this.postsRepository.findOneBy({
                slug: createPostDto.slug,
            });

            if (existPost) {
                throw new ConflictException(`Post with slug '${createPostDto.slug}' already exists`);
            }

            const post = this.postsRepository.create({
                ...createPostDto,
                author: user,
                tags,
            });
            return await this.postsRepository.save(post);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new InternalServerErrorException('Database error occurred while creating post', {
                    description: error.message,
                });
            }
            throw error;
        }
    }
}
