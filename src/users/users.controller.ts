import { Controller, Get, Post, Patch, Put, Delete, Param, Query, Body, Ip, Headers, ParseIntPipe, DefaultValuePipe, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamDto } from './dtos/get-user-param.dto';

@Controller('users')
export class UsersController {
    @Get('/:id?')
    public getUsers(@Param() getUserParamDto: GetUserParamDto,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        console.log(getUserParamDto)
        return 'You send a get request to users endpoint';
    }

    @Post()
    public createUsers(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto)
        return 'You send a post request to users endpoint';
    }
}
