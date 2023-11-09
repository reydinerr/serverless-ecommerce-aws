import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'O conteúdo do campo deve ser uma string válida' })
  @IsNotEmpty({ message: 'O campo não pode estar vazio' })
  name: string;

  @IsNumber(
    {},
    { each: true, message: 'O conteúdo do campo deve ser um número válido' },
  )
  @IsNotEmpty({ message: 'O campo não pode estar vazio' })
  price: number;

  @IsNumber(
    {},
    { each: true, message: 'O conteúdo do campo deve ser um número válido' },
  )
  @IsNotEmpty({ message: 'O campo não pode estar vazio' })
  quantity: number;
}
