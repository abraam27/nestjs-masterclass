import { Controller, Get } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  public login() {
    return this.authService.login('abraam@gmail.com', '123456', '1234');
  }
}
