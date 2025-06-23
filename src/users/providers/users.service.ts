import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-user-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateManyUserDto } from '../dtos/create-many-users.dto';
import { UsersCreateManyService } from './users-create-many.service.service';
import { PaginationProvider } from 'src/common/pagination/providers/pagination-provider';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email';

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
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersCreateManyService: UsersCreateManyService,
    private readonly paginationProvider: PaginationProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
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
   * Returns a specific user
   * @param email
   * @returns specific user
   */
  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }

  /**
   * Creates a new user
   * @param createUserDto
   * @returns created user
   */
  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async createMany(createManyUserDto: CreateManyUserDto) {
    return await this.usersCreateManyService.createMany(createManyUserDto);
  }
}
