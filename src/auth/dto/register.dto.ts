import { IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength, } from 'class-validator';
import { Rol } from '../../usuarios/enums/rol/rol.enum.js';
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;
}
