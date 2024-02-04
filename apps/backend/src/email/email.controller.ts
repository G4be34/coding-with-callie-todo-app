import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { UsersService } from 'src/users/users.service';
import { EmailService } from './email.service';

type EmailRequesType = {
  email: string;
  username: string;
};

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Public()
  verifyEmail(@Body() { email, username }: EmailRequesType) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return this.emailService.sendVerificationEmail(email, username, code);
  }

  @Get(':email')
  @Public()
  findExistingUser(@Param('email') email: string) {
    return this.usersService.findEmail(email);
  }
}
