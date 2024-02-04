import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email, username, code) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verification Email',
      template: 'verification',
      context: {
        username,
        code,
      },
    });

    return code;
  }
}
