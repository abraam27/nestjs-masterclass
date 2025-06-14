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
    return this.postsRepository.find({
      relations: ['author', 'tags', 'metaOptions'],
    });
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

  public async patchPost(patchPostDto: PatchPostDto) {
    const tags = await this.tagsService.findOneByMultipleIds(patchPostDto.tags);
    if (!tags) {
      throw new Error('Tags not found');
    }
    const post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    if (!post) {
      throw new Error('Post not found');
    }

    post.title = patchPostDto.title ?? post.title;
    post.postType = patchPostDto.postType ?? post.postType;
    post.status = patchPostDto.status ?? post.status;
    post.content = patchPostDto.content ?? post.content;
    post.slug = patchPostDto.slug ?? post.slug;
    post.schema = patchPostDto.schema ?? post.schema;
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;

    post.tags = tags;
    return this.postsRepository.save(post);
  }

  public async deletePost(id: number) {
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
}
