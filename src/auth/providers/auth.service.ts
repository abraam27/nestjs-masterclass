import { UsersService } from './../../users/providers/users.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=> UsersService))
        private readonly usersService: UsersService
    ) { }

    public login(email: string, password: string, id: string) {
        const user = this.usersService.findOneById("1234");
        console.log(user)
        return "SAMPLE_TOKEN";
    }

    public isAuth() {
        return true;
    }
}
