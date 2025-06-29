import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import { INestApplication } from '@nestjs/common';

export function appCreate(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle('NestJS Project')
        .setDescription('Use the base API URL as http://localhost:3000')
        .setTermsOfService('http://localhost:3000/terms-of-service')
        .setLicense(
            'MIT License',
            'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
        )
        .addServer('http://localhost:3000/')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    // Setup the aws sdk used to upload files to s3
    const configService = app.get(ConfigService);
    config.update({
        credentials: {
            accessKeyId: configService.get('appConfig.awsAccessKey'),
            secretAccessKey: configService.get('appConfig.awsSecretAccessKey'),
        },
        region: configService.get('appConfig.awsRegion'),
    });

    //enable cors
    app.enableCors();
}
