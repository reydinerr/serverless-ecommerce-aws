import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString({ message: 'O conteúdo do campo deve ser uma string válida' })
  name: string;

  @IsNumber(
    {},
    { each: true, message: 'O conteúdo do campo deve ser um número válido' },
  )
  price: number;

  @IsNumber(
    {},
    { each: true, message: 'O conteúdo do campo deve ser um número válido' },
  )
  quantity: number;
}
