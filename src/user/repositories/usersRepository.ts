import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Injectable } from '@nestjs/common';

export interface IListUser {
  totalPage: number;
  total: number;
  users: {
    id: string;
    name: string;
    email: string;
    age: number;
    cpf: string;
    avatar: string;
    created_at: Date;
    updated_at: Date;
  }[];
}

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  public async getAll(skip: number, take: number): Promise<IListUser> {
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          cpf: true,
          password: false,
          avatar: true,
          created_at: true,
          updated_at: true,
        },
        skip,
        take,
      }),
      this.prisma.user.count(),
    ]);

    const totalPage = Math.ceil(total / take);
    const result = { totalPage, total, users };

    return result;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async findByCpf(cpf: string) {
    return await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        age: true,
        password: false,
        avatar: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findByEmailWithPassword(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        age: true,
        password: true,
        avatar: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        age: true,
        password: true,
        avatar: true,
        created_at: true,
        updated_at: true,
      },
    });
    return user;
  }

  async delete(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return user;
  }
}
