import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './uploads.entity';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProvider],
  imports: [
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forFeature([Upload]),
  ],
})
export class UploadsModule {}
