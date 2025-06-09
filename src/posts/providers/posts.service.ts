import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { UsersService } from './../../users/providers/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      {
        user,
        title: 'test title',
        content: 'test content',
      },
      {
        user,
        title: 'test title 2',
        content: 'test content 2',
      },
    ];
  }

  public async createPost(createPostDto: CreatePostDto) {
    // let createPost = this.postsRepository.create(createPostDto);
    // createPost = await this.postsRepository.save(createPost);
    // return createPost;
  }

  public patchPost(id: number, patchPostDto: PatchPostDto) {
    return patchPostDto;
  }
}
