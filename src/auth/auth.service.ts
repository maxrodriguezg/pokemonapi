import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existente = await this.usuariosService.findByUsername(
      registerDto.username,
    );

    if (existente) {
      throw new ConflictException('El username ya está en uso');
    }

    const password = await hash(registerDto.password, 10);
    const usuario = await this.usuariosService.create({
      username: registerDto.username,
      password,
      rol: registerDto.rol,
    });

    return {
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
    };
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.findByUsername(
      loginDto.username,
    );

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await compare(loginDto.password, usuario.password);

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
