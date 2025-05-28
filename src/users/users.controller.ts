import { Controller, Get, Post, Patch, Put, Delete, Param, Query, Body, Ip, Headers } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get('/:id/:optional?')
    public getUsers(@Param('id') id: any, @Query('limit') limit: any) {
        console.log(id);
        console.log(limit);
        return 'You send a get request to users endpoint';
    }

    @Post()
    public createUsers(@Body() body: any, @Headers() headers: any, @Ip() ip: any) {
        console.log(body);
        console.log(headers);
        console.log(ip);
        return 'You send a post request to users endpoint';
    }
}
