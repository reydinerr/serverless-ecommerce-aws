import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Injectable } from '@nestjs/common';

export interface IListProduct {
  totalPage: number;
  total: number;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  public async getAll(skip: number, take: number): Promise<IListProduct> {
    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
        },
        skip,
        take,
      }),
      this.prisma.product.count(),
    ]);

    const totalPage = Math.ceil(total / take);
    const result = { totalPage, total, products };

    return result;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    return product;
  }

  async findByName(name: string) {
    return await this.prisma.product.findUnique({
      where: {
        name,
      },
    });
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data,
    });
    return product;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data,
    });
    return product;
  }

  async delete(id: string): Promise<Product> {
    const product = await this.prisma.product.delete({
      where: {
        id,
      },
    });
    return product;
  }
}
