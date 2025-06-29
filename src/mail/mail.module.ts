import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Global()
@Module({
  imports: [MailerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      transport: {
        host: configService.get('appConfig.mailHost'),
        secure: false,
        port: configService.get('appConfig.mailPort'),
        auth: {
          user: configService.get('appConfig.smtpUsername'),
          pass: configService.get('appConfig.smtpPassword'),
        },
        default: {
          from: `My Platform <${configService.get('appConfig.mailHost')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
            
          }),
          options: {
            strict: false,
          },
        },
      },
    }),
  })],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
