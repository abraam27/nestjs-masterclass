import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appCreate } from 'src/app.create';
import { INestApplication } from '@nestjs/common';

export async function bootstrapNestApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, ConfigModule],
        providers: [ConfigService],
      }).compile();

    const app = moduleFixture.createNestApplication();
    appCreate(app);
    await app.init();
    return app;
}
