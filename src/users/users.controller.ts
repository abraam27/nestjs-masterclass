import { Controller, Get, Post, Patch, Put, Delete, Param, Query, Body, Ip, Headers, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get('/:id?')
    public getUsers(@Param('id', ParseIntPipe) id: number | undefined,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        console.log(id);
        console.log(limit);
        console.log(page);
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
