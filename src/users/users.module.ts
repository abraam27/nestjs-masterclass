import { AuthModule } from './../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { UsersCreateManyService } from './providers/users-create-many.service.service';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyService],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    PaginationModule
  ],
})
export class UsersModule {}
