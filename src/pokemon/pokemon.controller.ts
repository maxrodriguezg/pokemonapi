import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';
import { Rol } from '../usuarios/enums/rol/rol.enum.js';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { CreateTipoDto } from './dto/create-tipo.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { PokemonService } from './pokemon.service.js';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Roles(Rol.DOCTOR)
  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Roles(Rol.DOCTOR)
  @Post('tipo')
  createTipo(@Body() createTipoDto: CreateTipoDto) {
    return this.pokemonService.createTipo(createTipoDto);
  }

  @Get()
  findAll(@CurrentUser() usuario: JwtPayload) {
    return this.pokemonService.findAll(usuario);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() usuario: JwtPayload) {
    return this.pokemonService.findOne(+id, usuario);
  }

  @Roles(Rol.DOCTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(+id, updatePokemonDto);
  }

  @Roles(Rol.DOCTOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(+id);
  }

  @Roles(Rol.ENTRENADOR)
  @Post(':id/capturar')
  capturar(@Param('id') id: string, @CurrentUser() usuario: JwtPayload) {
    return this.pokemonService.capturar(+id, usuario.sub);
  }

  @Roles(Rol.ENTRENADOR)
  @Delete(':id/capturar')
  liberar(@Param('id') id: string, @CurrentUser() usuario: JwtPayload) {
    return this.pokemonService.liberar(+id, usuario.sub);
  }
}
