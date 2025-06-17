import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { RequestTimeoutException } from '@nestjs/common';
import { CreateManyUserDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyService {
    constructor(private readonly dataSource: DataSource) {}

    public async createMany(createManyUserDto: CreateManyUserDto) {
        let users: User[] = [];
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const user of createManyUserDto.users) {
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
