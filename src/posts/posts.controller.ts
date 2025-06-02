import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './providers/posts.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('/:userId?')
    allPosts(@Param('userId') userId: string) {
        return this.postsService.findAll(userId);
    }
}
