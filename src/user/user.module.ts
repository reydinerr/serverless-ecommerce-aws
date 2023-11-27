import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from './repositories/usersRepository';
import { HashPassword } from './entities/hash/IHashPassword';
import DiskStorageProvider from './entities/provider/diskStorageProvider';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    UsersRepository,
    HashPassword,
    DiskStorageProvider,
  ],
  exports: [UserService],
})
export class UserModule {}
