import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}
    public async sendUserWelcomeMail(user: User): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                from: 'My Platform <myplatform@gmail.com>',
                subject: 'Welcome to our platform',
                template: '../templates/welcome',
                context: {
                    name: user.firstName,
                    email: user.email,
                    loginLink: 'http://localhost:3000/login',
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
