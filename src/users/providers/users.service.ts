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
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Returns an array of registered users or a specific user
   * @param getUserParamDto
   * @param limit
   * @param page
   * @returns array of registered users or a specific user
   */
  public findAll(
    getUserParamDto: GetUserParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        statusCode: HttpStatus.NOT_IMPLEMENTED,
        error: 'Not implemented',
        fileName: __filename,
        className: this.constructor.name,
        methodName: 'findAll',
        line: 48,
      },
      HttpStatus.NOT_IMPLEMENTED,
      {
        cause: new Error(),
        description: 'The Api is not implemented yet',
      },
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

  public async createMany(createUsersDto: CreateUserDto[]) {
    let users: User[] = [];
    let existUser = undefined;
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      for (const user of createUsersDto) {
        existUser = await this.usersRepository.findOne({
          where: { email: user.email },
        });
        if (existUser) {
          queryRunner.rollbackTransaction();
          throw new BadRequestException('User already exists');
        }

        let createUser = queryRunner.manager.create(User, user);
        const savedUser = await queryRunner.manager.save(createUser);
        users.push(savedUser);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RequestTimeoutException(
        'Unable to process your request at this moment',
        {
          description: 'Error Connecting to the database',
        },
      );
    } finally {
      await queryRunner.release();
    }
    return users;
  }
}
