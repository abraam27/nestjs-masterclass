import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-user-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

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
  ) {}

  /**
   * Returns an array of registered users or a specific user
   * @param getUserParamDto
   * @param limit
   * @param page
   * @returns
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
   * @returns
   */
  public findOneById(id: string) {
    return {
      id: 123,
      firstName: 'Abraam',
      email: 'abraam@gmail.com',
    };
  }
}
