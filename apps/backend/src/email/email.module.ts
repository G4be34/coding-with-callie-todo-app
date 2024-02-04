import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [
    UsersModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'jimenezgabriel12@gmail.com',
          pass: 'vjhd beqp tnkh owiv',
        },
      },
      defaults: {
        from: '"CWC No Reply" <cwc-no-reply@gmail.com>',
      },
      preview: false,
      template: {
        dir: process.cwd() + '/src/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
