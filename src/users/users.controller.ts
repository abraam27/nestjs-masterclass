import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Ip,
  Headers,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamDto } from './dtos/get-user-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Users controller
 * Handles all user related operations
 */
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Returns an array of registered users or a specific user
   * @param getUserParamDto 
   * @param limit 
   * @param page 
   * @returns 
   */
  @Get('/:id?')
  @ApiOperation({
    summary: 'Returns an array of registered users or a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of registered users or a specific user',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The Number of users to return',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'The Page of users',
    example: 1,
  })
  public getUsers(
    @Param() getUserParamDto: GetUserParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUserParamDto, limit, page);
  }

  /**
   * Creates a new user
   * @param createUserDto 
   * @returns created user
   */
  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Updates a user
   * @param patchUserDto 
   * @returns 
   */
  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
