import {
  Column,
  Entity,
  JoinTable,
  ManyToMany, // Decorador para definir una relación de muchos a muchos entre entidades
  PrimaryGeneratedColumn, // Decorador para definir la clave primaria autoincremental de la tabla
} from 'typeorm'; // Cierra la sentencia de importación desde 'typeorm'
import { Tipo } from './tipos.entity.js'; // Importa la entidad 'Tipo' relacionada desde su archivo local
import { Usuario } from '../../usuarios/entities/usuario.entity.js';

@Entity('pokemon') // Indica que esta clase representa una tabla en la base de datos llamada 'pokemon'
export class Pokemon {
  // Declara y exporta la clase TypeScript llamada 'Pokemon'
  @PrimaryGeneratedColumn() // Define la propiedad 'id' como la clave primaria que se incrementa automáticamente
  id: number; // Declara la propiedad 'id' de tipo numérico para identificar cada registro

  @Column({ length: 50 }) // Define esta propiedad como una columna de tipo texto con un límite estricto de 50 caracteres
  nombre: string; // Declara la propiedad 'nombre' de tipo string para almacenar el nombre del Pokémon

  @Column({ length: 250 }) // Define esta propiedad como una columna de texto con un límite máximo de 250 caracteres
  descripcion: string; // Declara la propiedad 'descripcion' de tipo string para guardar una breve descripción

  @ManyToMany(() => Tipo, (tipo) => tipo.pokemons, {
  })
  @JoinTable({
    name: 'pokemon_tipos',
  })
  types: Tipo[]; // Declara la propiedad 'types' como un arreglo de objetos de tipo 'Tipo', representando los tipos del Pokémon

  @ManyToMany(() => Usuario, (usuario) => usuario.pokemons, {
    onDelete: 'CASCADE', })
  @JoinTable({
    name: 'pokemon_propietarios',
  })
  propietarios: Usuario[];
} // Cierra la definición de la clase Pokemon


