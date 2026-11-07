import {
  // Inicio de las importaciones necesarias desde la librería de TypeORM
  Column, // Decorador para definir columnas regulares en la tabla de la base de datos
  Entity, // Decorador para indicar que esta clase es una entidad (tabla) de base de datos
  JoinTable, // Decorador obligatorio en un lado de la relación Many-to-Many para crear la tabla intermedia
  ManyToMany, // Decorador para definir una relación de muchos a muchos entre entidades
  PrimaryGeneratedColumn, // Decorador para definir la clave primaria autoincremental de la tabla
} from 'typeorm'; // Cierra la sentencia de importación desde 'typeorm'
import { Tipo } from './tipos.entity.js'; // Importa la entidad 'Tipo' relacionada desde su archivo local

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
    // Establece una relación de muchos a muchos con la entidad 'Tipo', apuntando a su propiedad inversa 'tipo.pokemons'
    // Sin cascade: los tipos deben existir antes; al crear un Pokémon solo se enlazan por id
  }) // Cierra los parámetros de configuración del decorador @ManyToMany
  @JoinTable({
    // Define la tabla intermedia o pivote que une ambas entidades en la base de datos
    name: 'pokemon_tipos', // Opcional: asigna un nombre personalizado ('pokemon_tipos') a dicha tabla intermedia en lugar de uno automático
  }) // Cierra los parámetros de configuración del decorador @JoinTable
  types: Tipo[]; // Declara la propiedad 'types' como un arreglo de objetos de tipo 'Tipo', representando los tipos del Pokémon
} // Cierra la definición de la clase Pokemon
