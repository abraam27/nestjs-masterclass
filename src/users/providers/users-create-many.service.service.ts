import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { RequestTimeoutException } from '@nestjs/common';
import { CreateManyUserDto } from '../dtos/create-many-users.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersCreateManyService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createMany(createManyUserDto: CreateManyUserDto) {
    let users: User[] = [];
    let queryRunner;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const user of createManyUserDto.users) {
        const existUser = await this.usersRepository.findBy({
          email: user.email,
        });
        if (existUser) {
          await queryRunner.rollbackTransaction();
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
