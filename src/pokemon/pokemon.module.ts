import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { PokemonController } from './pokemon.controller.js';
import { Pokemon } from './entities/pokemon.entity.js';
import { Tipo } from './entities/tipos.entity.js';
import { PokemonService } from './pokemon.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon]),
    TypeOrmModule.forFeature([Tipo]),
    UsuariosModule,
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
