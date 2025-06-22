import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    public async findOneByEmail(email: string) {
        let user = undefined;
        try {
            user = await this.usersRepository.findOneBy({ email });
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
}
