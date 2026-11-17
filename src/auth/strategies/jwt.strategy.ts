import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { JwtPayload } from '../interfaces/jwt-payload.interface.js';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const usuario = await this.usuariosService.findById(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no existe');
    }

    return {
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
    };
  }
}
