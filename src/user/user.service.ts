import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/usersRepository';
import { User } from './entities/user.entity';
import { HashPassword } from './entities/hash/IHashPassword';
import DiskStorageProvider from './entities/provider/diskStorageProvider';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UsersRepository,
    private hashProvider: HashPassword,
    private diskStorageProvider: DiskStorageProvider,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userCpfExists = await this.usersRepository.findByCpf(
      createUserDto.cpf,
    );
    const userEmailExists = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (userCpfExists || userEmailExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = this.hashProvider.generateHash(
      createUserDto.password,
    );

    createUserDto.password = await hashedPassword;

    const user = await this.usersRepository.create(createUserDto);

    return user;
  }

  async findAll() {
    return await this.usersRepository.getAll(0, 10);
  }

  async findOne(id: string) {
    return await this.usersRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userEmailExists = await this.usersRepository.findByEmail(
      updateUserDto.email,
    );

    if (userEmailExists && userEmailExists.id !== id) {
      throw new HttpException(
        'There is already one user with this email.',
        HttpStatus.CONFLICT,
      );
    }

    if (updateUserDto.password && !updateUserDto.old_password) {
      throw new UnauthorizedException('Password is required!');
    }

    if (updateUserDto.password && updateUserDto.old_password) {
      const checkCurrentPassword = await this.hashProvider.compareHash(
        updateUserDto.old_password,
        user.password,
      );

      if (!checkCurrentPassword) {
        throw new UnauthorizedException('Old password is not match!');
      }

      if (updateUserDto.password === updateUserDto.old_password) {
        throw new HttpException(
          'New password cannot be the same as the old one',
          HttpStatus.CONFLICT,
        );
      }

      const hashedPassword = await this.hashProvider.generateHash(
        updateUserDto.password,
      );

      updateUserDto.password = hashedPassword;
    }

    user.email = updateUserDto.email;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { old_password, ...userUpdated } = updateUserDto;

    return await this.usersRepository.update(id, userUpdated);
  }

  async updateAvatar(id: string, file: string) {
    const user = await this.usersRepository.findById(id);
    console.log('🚀 ~ file: user.service.ts:110 ~ updateAvatar ~ user:', user);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // if (uploadConfig.driver === 's3') {
    //   const s3Provider = new S3StorageProvider();
    //   if (user.avatar) {
    //     await s3Provider.deleteFile(user.avatar);
    //   }
    //   const filename = await s3Provider.saveFile(updateAvatarDto.avatar);
    //   user.avatar = filename;
    // } else {
    if (user.avatar) {
      await this.diskStorageProvider.deleteFile(user.avatar);
    }
    const filename = await this.diskStorageProvider.saveFile(file);
    user.avatar = filename;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, email, avatar, password } = user;
    const userUpdated = { name, email, avatar, password };

    return await this.usersRepository.update(id, userUpdated);
  }

  async remove(id: string) {
    const userExists = await this.usersRepository.findById(id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    return await this.usersRepository.delete(id);
  }
}
