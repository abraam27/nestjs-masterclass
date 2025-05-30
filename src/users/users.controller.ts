import { Controller, Get, Post, Patch, Put, Delete, Param, Query, Body, Ip, Headers, ParseIntPipe, DefaultValuePipe, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamDto } from './dtos/get-user-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Get('/:id?')
    public getUsers(@Param() getUserParamDto: GetUserParamDto,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        return this.usersService.findAll(getUserParamDto, limit, page);
    }

    @Post()
    public createUser(@Body() createUserDto: CreateUserDto) {
        return createUserDto;
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto) {
        return patchUserDto;
    }
}
