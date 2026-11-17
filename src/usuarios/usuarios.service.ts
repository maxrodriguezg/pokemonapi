import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';
import { Rol } from './enums/rol/rol.enum.js';


export interface CreateUsuarioData {
  username: string;
  password: string;
  rol?: Rol;
}

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  findByUsername(username: string): Promise<Usuario | null> {
    return this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.username = :username', { username })
      .getOne();
  }

  findById(id: number): Promise<Usuario | null> {
    return this.usuariosRepository.findOneBy({ id });
  }

  create(data: CreateUsuarioData): Promise<Usuario> {
    const usuario = this.usuariosRepository.create({
      username: data.username,
      password: data.password,
      rol: data.rol ?? Rol.ENTRENADOR,
    });

    return this.usuariosRepository.save(usuario);

  }
}
