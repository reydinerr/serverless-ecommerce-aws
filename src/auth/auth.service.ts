import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenOutput } from './repositories/token.entity';
import { HashPassword } from '../user/entities/hash/IHashPassword';
import { UsersRepository } from 'src/user/repositories/usersRepository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private hashPassword: HashPassword,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<TokenOutput> {
    const user = await this.usersRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const confirmedPassword = await this.hashPassword.compareHash(
      pass,
      user.password,
    );

    if (!confirmedPassword) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
