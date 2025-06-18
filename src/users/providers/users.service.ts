import {
  BadRequestException,
  forwardRef,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { GetUserParamDto } from '../dtos/get-user-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import profileConfig from '../config/profile.config';
import { CreateManyUserDto } from '../dtos/create-many-users.dto';
import { UsersCreateManyService } from './users-create-many.service.service';
import { PaginationProvider } from 'src/common/pagination/providers/pagination-provider';

/**
 * Users service
 * Handles all user related operations
 */
@Injectable()
export class UsersService {
  /**
   * Constructor
   * @param authServices
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authServices: AuthService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersCreateManyService: UsersCreateManyService,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  /**
   * Returns an array of registered users or a specific user
   * @param getUserParamDto
   * @param limit
   * @param page
   * @returns array of registered users or a specific user
   */
  public async findAll(
    getUserParamDto: GetUserParamDto,
    limit: number,
    page: number,
  ) {
    return await this.paginationProvider.paginateQuery(
      {
        limit,
        page,
      },
      this.usersRepository,
    );
  }

  /**
   * Returns a specific user
   * @param id
   * @returns specific user
   */
  public findOneById(id: number) {
    let user = undefined;
    try {
      user = this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at this moment',
        {
          description: 'Error Connecting to the database',
        },
      );
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Creates a new user
   * @param createUserDto
   * @returns created user
   */
  public async createUser(createUserDto: CreateUserDto) {
    let existUser = undefined;
    try {
      existUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at this moment',
        {
          description: 'Error Connecting to the database',
        },
      );
    }
    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    try {
      let createUser = this.usersRepository.create(createUserDto);
      createUser = await this.usersRepository.save(createUser);
      return createUser;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at this moment',
        {
          description: 'Error Connecting to the database',
        },
      );
    }
  }

  public async createMany(createManyUserDto: CreateManyUserDto) {
    return await this.usersCreateManyService.createMany(createManyUserDto);
  }
}
