import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { UsersService } from 'src/users/users.service';
import { EmailService } from './email.service';

type EmailRequesType = {
  email: string;
  username?: string;
};

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Public()
  async verifyEmail(@Body() { email, username }: EmailRequesType) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    let result;
    let name = username || '';
    if (!username) {
      result = await this.usersService.findEmail(email);
      if (!result) {
        throw new NotFoundException('User not found');
      }
      name = result.username;
    }
    const returnCode = await this.emailService.sendVerificationEmail(
      email,
      name,
      code,
    );

    return {
      code: returnCode,
      id: result?.id,
    };
  }

  @Get(':email')
  @Public()
  findExistingUser(@Param('email') email: string) {
    return this.usersService.findEmail(email);
  }
}
