import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.validateUser(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user.id, email: user.email };

      return { access_token: await this.jwtService.signAsync(payload) };
    }
    throw new UnauthorizedException();
  }
}
