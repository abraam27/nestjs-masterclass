import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RequestTimeoutException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashProvider: HashingProvider,
  ) {}

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
      let createUser = this.usersRepository.create({
        ...createUserDto,
        password: await this.hashProvider.hashPassword(createUserDto.password),
      });
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
}
