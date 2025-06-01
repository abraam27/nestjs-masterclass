import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
    constructor() { }

    public findAll(userId: string) {
        console.log('All post of specific user' + userId);
    }
}
