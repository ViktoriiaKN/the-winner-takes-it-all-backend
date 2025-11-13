import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import type { StringValue } from 'ms'; // ⬅️ додали

export type JwtPayload = { sub: string; email: string; role: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async register(email: string, password: string) {
    const user = await this.users.create(email, password);
    return this.sign(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await this.users.validatePassword(user, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user.id, user.email, user.role);
  }

  private async sign(sub: string, email: string, role: string) {
    const payload: JwtPayload = { sub, email, role };

    const exp = (this.cfg.get<string>('JWT_EXPIRES') ?? '1d') as StringValue; // ⬅️ привели до правильного типу
    const options: JwtSignOptions = { expiresIn: exp };

    const token = await this.jwt.signAsync(payload, options);
    return { access_token: token };
  }
}
