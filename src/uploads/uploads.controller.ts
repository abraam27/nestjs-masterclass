import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './providers/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeader, ApiHeaders, ApiOperation } from '@nestjs/swagger';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @UseInterceptors(FileInterceptor('file'))
  @ApiHeaders([
    {
      name: 'Content-Type',
      description: 'multipart/form-data',
    },
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiOperation({ summary: 'Upload a file' })
  @Post('file')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file);
  }
}
