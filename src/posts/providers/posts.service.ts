import { CreatePostDto } from '../dtos/create-post.dto';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { UsersService } from './../../users/providers/users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { NotFoundError } from 'rxjs';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination-provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly tagsService: TagsService,
    private readonly createPostProvider: CreatePostProvider,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public findAll(query: GetPostsDto): Promise<Paginated<Post>> {
    return this.paginationProvider.paginateQuery(
      {
        limit: query.limit,
        page: query.page,
      },
      this.postsRepository,
    );
  }

  public async createPost(createPostDto: CreatePostDto, authorId: number) {
    return await this.createPostProvider.createPost(createPostDto, authorId);
  }

  public async patchPost(patchPostDto: PatchPostDto) {
    let tags = undefined;
    let post = undefined;
    try {
      tags = await this.tagsService.findOneByMultipleIds(patchPostDto.tags);
      if (!tags || tags.length != patchPostDto.tags.length) {
        throw new BadRequestException(
          'Please check your tags Ids and insure they are correct',
        );
      }

      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      post.title = patchPostDto.title ?? post.title;
      post.postType = patchPostDto.postType ?? post.postType;
      post.status = patchPostDto.status ?? post.status;
      post.content = patchPostDto.content ?? post.content;
      post.slug = patchPostDto.slug ?? post.slug;
      post.schema = patchPostDto.schema ?? post.schema;
      post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;
      post.tags = tags;

      return this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at this moment',
        {
          description: 'Error Connecting to the database',
        },
      );
    }
  }

  public async deletePost(id: number) {
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
}
