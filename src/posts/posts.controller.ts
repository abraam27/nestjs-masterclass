import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './providers/posts.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('/:userId?')
    allPosts(@Param('userId') userId: string) {
        return this.postsService.findAll(userId);
    }

    @Post()
    createPost(@Body() createPostDto: CreatePostDto) {
        return this.postsService.createPost(createPostDto);
    }
}
