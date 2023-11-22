import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserModule } from 'src/user/user.module';
import { UsersRepository } from 'src/user/repositories/usersRepository';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashPassword } from 'src/user/entities/hash/IHashPassword';
import { UserController } from 'src/user/user.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [UsersRepository, PrismaService, HashPassword, AuthService],
  controllers: [UserController, AuthController],
  exports: [AuthService],
})
export class AuthModule {}
