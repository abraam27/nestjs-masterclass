import { SignInDto } from '../dtos/signin.dto';
import { Injectable } from '@nestjs/common';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,
    ) { }

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public isAuth() {
    return true;
  }
}
