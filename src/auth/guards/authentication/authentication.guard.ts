import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { console } from 'inspector';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthTypeKey: AuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthTypeKey];

    const guards = authTypes
      .map((authType) => this.authTypeGuardMap[authType])
      .flat();

    const error = new UnauthorizedException();

    for (const guard of guards) {
      console.log(guard);
      try {
        const canActivate = await Promise.resolve(guard.canActivate(context));
        console.log(canActivate);
        if (canActivate) {
          return true;
        }
      } catch (err) {
        // If one guard fails, continue to the next one
        continue;
      }
    }
    throw error;
  }
}
