import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from '../enums/rol/rol.enum.js';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Rol, default: Rol.ENTRENADOR })
  rol: Rol;
}
