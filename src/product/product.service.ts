import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  IListProduct,
  ProductsRepository,
} from './repositories/productsRepository';

@Injectable()
export class ProductService {
  constructor(private productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    const productExists = await this.productsRepository.findByName(
      createProductDto.name,
    );

    if (productExists) {
      throw new NotFoundException('Product with name already exists');
    }
    const product = await this.productsRepository.create(createProductDto);

    return product;
  }

  async getAll(): Promise<IListProduct> {
    return await this.productsRepository.getAll(0, 10);
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productIdExists = await this.productsRepository.findById(id);

    if (!productIdExists) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.name) {
      const productNameExists = await this.productsRepository.findByName(
        updateProductDto.name,
      );

      if (productNameExists) {
        throw new HttpException(
          'Product with name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const product = await this.productsRepository.update(id, updateProductDto);

    return product;
  }

  async delete(id: string) {
    const productExists = await this.productsRepository.findById(id);
    if (!productExists) {
      throw new NotFoundException('Product not found!');
    }

    const product = await this.productsRepository.delete(id);
    return product;
  }
}
