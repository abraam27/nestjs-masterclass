import { PostsService } from './providers/posts.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('/:userId?')
    allPosts(@Param('userId') userId: string) {
        return this.postsService.findAll(userId);
    }
}
