import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../uploads.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { FileTypes } from '../enums/file-types.enums';
import { UploadFile } from '../interfaces/upload-file.interface';
@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    private readonly configService: ConfigService,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    try {
      if (
        ![
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/webp',
          'image/gif',
          'image/svg+xml',
          'image/bmp',
          'image/tiff',
          'image/webp',
          'image/avif',
        ].includes(file.mimetype)
      ) {
        throw new BadRequestException('Invalid file type');
      }
      const name = await this.uploadToAwsProvider.uploadFile(file);
      const uploadFile: UploadFile = {
        name: name,
        path: `https://${this.configService.get('appConfig.cloudinaryCloudName')}/${name}`,
        type: FileTypes.IMAGE,
        mime_type: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
