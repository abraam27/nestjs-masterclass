import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}

  public async uploadFile(file: Express.Multer.File) {
    try {
      const s3 = new S3({
        region: this.configService.get('appConfig.awsRegion'),
        credentials: {
          accessKeyId: this.configService.get('appConfig.awsAccessKey'),
          secretAccessKey: this.configService.get(
            'appConfig.awsSecretAccessKey',
          ),
        },
      });
      const params = {
        Bucket: this.configService.get('appConfig.awsBucketName'),
        Key: this.generateUniqueFileName(file.originalname),
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const uploadResponse = await s3.upload(params).promise();
      return uploadResponse.Location;
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Unable to upload file',
      });
    }
  }

  private generateUniqueFileName(fileName: string): string {
    const fileExtension = path.extname(fileName);
    let fileNameWithoutExtension = path.basename(fileName, fileExtension);
    fileNameWithoutExtension.replace(/\s/g, '').trim();
    const uniqueFileName = `${new Date().getTime().toString().trim()}-${uuidv4()}-${fileExtension}-${fileNameWithoutExtension}`;
    return uniqueFileName;
  }
}
