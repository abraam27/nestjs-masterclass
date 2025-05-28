import { Controller, Get, Post, Patch, Put, Delete, Param, Query, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get('/:id/:optional?')
    public getUsers(@Param() param: any, @Query() query: any) {
        console.log(param);
        console.log(query);
        return 'You send a get request to users endpoint';
    }

    @Post()
    public createUsers(@Body() body: any) {
        console.log(body)
        return 'You send a post request to users endpoint';
    }
}
