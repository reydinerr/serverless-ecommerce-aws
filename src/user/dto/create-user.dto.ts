import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome deve estar uma string' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  name: string;

  @IsEmail({}, { message: 'O email deve estar um email válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  email: string;

  @IsInt({ message: 'A idade deve estar um número inteiro' })
  @Min(0, { message: 'A idade não pode estar negativa' })
  @Max(99, { message: 'A idade não pode estar maior que 99' })
  @IsNotEmpty({ message: 'A idade não pode estar vazia' })
  age: number;

  @IsString({ message: 'O cpf deve estar uma string' })
  @IsNotEmpty({ message: 'O cpf não pode estar vazio' })
  cpf: string;

  @IsString({ message: 'A senha deve estar uma string' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Insira o avatar' })
  avatar?: string;
}
