import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service.js';
import { PokemonController } from './pokemon.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity.js';
import { Tipo } from './entities/tipos.entity.js';

@Module({
  imports: [
    //importación de las dos tablas al modulo
    TypeOrmModule.forFeature([Pokemon]),
    TypeOrmModule.forFeature([Tipo])
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
