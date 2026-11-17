import { SetMetadata } from '@nestjs/common';
import { Rol } from '../../usuarios/enums/rol/rol.enum.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);
