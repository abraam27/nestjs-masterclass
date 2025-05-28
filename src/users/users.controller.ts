import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get()
    public getUsers() {
        return 'You send a get request to users endpoint';
    }

    @Post()
    public createUsers(){
        return 'You send a post request to users endpoint';
    }
}
