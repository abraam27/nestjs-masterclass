import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-user-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

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
    console.log(this.authServices.isAuth());
    return [
      {
        firstName: 'Abraam',
        email: 'abraam@gmail.com',
      },
      {
        firstName: 'Sara',
        email: 'sara@gmail.com',
      },
    ];
  }

  /**
   * Returns a specific user
   * @param id
   * @returns specific user
   */
  public findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * Creates a new user
   * @param createUserDto
   * @returns created user
   */
  public async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existUser) {
      throw new Error('User already exists');
    }
    let createUser = this.usersRepository.create(createUserDto);
    createUser = await this.usersRepository.save(createUser);
    return createUser;
  }
}
