import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { UsersService } from './../../users/providers/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
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
    let metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      metaOptions = await this.metaOptionsRepository.save(metaOptions);
    }

    let post = this.postsRepository.create(createPostDto);

    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    return await this.postsRepository.save(post);
  }

  public patchPost(id: number, patchPostDto: PatchPostDto) {
    return patchPostDto;
  }
}
