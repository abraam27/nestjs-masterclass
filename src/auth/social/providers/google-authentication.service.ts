import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { GoogleUser } from 'src/users/interfaces/google-user.interface';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauth2Client: OAuth2Client;
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigOptions: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  onModuleInit() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.oauth2Client = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the Google Token sent by User
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // Exract the payload from Google Token
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = ticket.getPayload();
      if (!email || !googleId) {
        throw new UnauthorizedException('Invalid Google Token', {
          description: 'Invalid Google Token',
        });
      }
      // Find the user in the database using the googleId
      const user = await this.usersService.findOneByGoogleId(googleId);
      // If googleId exists, generate tokens
      if (user) {
        return this.generateTokensProvider.generateTokens(user);
      }
      // If googleId does not exist, create a new user and generate tokens
      const googleUser: GoogleUser = {
        email,
        googleId,
        firstName,
        lastName,
      };
      const createdUser = await this.usersService.createGoogleUser(googleUser);
      return this.generateTokensProvider.generateTokens(createdUser);
    } catch (error) {
      throw new UnauthorizedException(error, {
        description: 'Could not authenticate user',
      });
    }
  }
}
