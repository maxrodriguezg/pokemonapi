import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { CreateTipoDto } from './dto/create-tipo.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity.js';
import { Tipo } from './entities/tipos.entity.js';

@Injectable()
export class PokemonService {
  //Crea el cronstructor para Injectar los repositorios
  constructor(
    // Injecta el repositorio y lo disponibiliza como una constante privada
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Tipo)
    private tipoRepository: Repository<Tipo>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    const { tipos: tipoIds, ...datos } = createPokemonDto;

    const tipos = await this.resolverTipos(tipoIds);

    const pokemon = this.pokemonRepository.create({ ...datos, types: tipos });

    return this.pokemonRepository.save(pokemon);
  }


  async createTipo(createTipoDto: CreateTipoDto) {
    const existe = await this.tipoRepository.findOneBy({
      nombre: createTipoDto.nombre,
    });
    if (existe) {
      throw new ConflictException(
        `Ya existe el tipo ${createTipoDto.nombre}`,
      );
    }
    return this.tipoRepository.save(createTipoDto);
  }

  findAll() {
    return this.pokemonRepository.find({ relations: { types: true } });
  }

  async findOne(id: number) {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: { types: true },
    });
    if (!pokemon) {
      throw new NotFoundException(`No existe el pokemon con id ${id}`);
    }
    return pokemon;
  }


  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const { tipos: tipoIds, ...datos } = updatePokemonDto;

    const pokemon = await this.findOne(id); //

    if (tipoIds !== undefined) {
      pokemon.types = await this.resolverTipos(tipoIds);
    }

    this.pokemonRepository.merge(pokemon, datos);
    return this.pokemonRepository.save(pokemon);
  }

  async remove(id: number) {
    const pokemon = await this.findOne(id);
    if (!pokemon) {
      throw new NotFoundException(`No existe el pokemon con id ${id}`);
    }
    await this.pokemonRepository.remove(pokemon);
    return { message: `Pokemon con id ${id} eliminado` };
  }

  // metodos axiliares privados

  private async resolverTipos(tipoIds: number[]): Promise<Tipo[]> {
    const tipos = await this.tipoRepository.findBy({ id: In(tipoIds) });

    if (tipos.length !== tipoIds.length) {
      const encontrados = tipos.map((tipo) => tipo.id);
      const faltantes = tipoIds.filter((id) => !encontrados.includes(id));
      throw new BadRequestException(
        `no existen los tipos con id: ${faltantes.join(', ')}`,
      );
    }

    return tipos;
  }
}
