import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from './../../users/providers/users.service';
import { forwardRef, Inject } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly hashProvider: HashingProvider,
    ) { }

    public async signIn(signInDto: SignInDto) {
        const user = await this.usersService.findOneByEmail(signInDto.email);
        let isMatch = false;
        try {
            isMatch = await this.hashProvider.comparePassword(
                signInDto.password,
                user.password,
            );
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at this moment',
                {
                    description: 'Could not compare passwords',
                },
            );
        }   
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect email or password');
        }
        return true;    
    }
}
