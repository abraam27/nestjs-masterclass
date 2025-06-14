import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { UsersService } from './../../users/providers/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { TagsService } from 'src/tags/providers/tags.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
  ) {}

  public findAll() {
    return this.postsRepository.find();
  }

  public async createPost(createPostDto: CreatePostDto) {
    const tags = await this.tagsService.findOneByMultipleIds(createPostDto.tags);
    const user = await this.usersService.findOneById(createPostDto.authorId);
    if (!user) {
      throw new Error('User not found');
    }
    let post = this.postsRepository.create({
      ...createPostDto,
      author: user,
      tags,
    });
    return await this.postsRepository.save(post);
  }

  public patchPost(id: number, patchPostDto: PatchPostDto) {
    return patchPostDto;
  }

  public async deletePost(id: number) {
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
}
