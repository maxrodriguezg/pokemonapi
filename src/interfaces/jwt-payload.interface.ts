import { Rol } from '../usuarios/enums/rol/rol.enum.js';

export interface JwtPayload {
  sub: number;
  username: string;
  rol: Rol;
}
