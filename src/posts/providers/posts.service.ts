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
    return this.postsRepository.find();
  }

  public async createPost(createPostDto: CreatePostDto) {
    let post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  public patchPost(id: number, patchPostDto: PatchPostDto) {
    return patchPostDto;
  }

  public async deletePost(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new Error('Post not found');
    }
    console.log(post.metaOptions.id);
    // await this.postsRepository.delete(id);
    // await this.metaOptionsRepository.delete(post.metaOptions.id);
    const reversePost = await this.metaOptionsRepository.find({
      where: { id: post.metaOptions.id },
      relations: { post: true },
    });
    console.log(reversePost);
    return { deleted: true, id };
  }
}
