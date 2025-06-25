import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existUser = undefined;
    try {
      existUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at this moment',
        {
          description: 'Error Connecting to the database',
        },
      );
    }
    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    try {
      let createUser = this.usersRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      createUser = await this.usersRepository.save(createUser);
      try {
        await this.mailService.sendUserWelcomeMail(createUser);
      } catch (error) {
        throw new RequestTimeoutException(error);
      }
      return createUser;
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Unable to process your request at this moment',
        {
          description: 'Error Connecting to the database',
        },
      );
    }
  }
}
