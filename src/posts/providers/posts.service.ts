import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { UsersService } from './../../users/providers/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

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

  public createPost(createPostDto: CreatePostDto) {
    return createPostDto;
  }

  public patchPost(id: number, patchPostDto: PatchPostDto) {
    return patchPostDto;
  }
}
