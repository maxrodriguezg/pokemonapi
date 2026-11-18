import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';
import { Rol } from '../usuarios/enums/rol/rol.enum.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { CreateTipoDto } from './dto/create-tipo.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { Pokemon } from './entities/pokemon.entity.js';
import { Tipo } from './entities/tipos.entity.js';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Tipo)
    private tipoRepository: Repository<Tipo>,
    private readonly usuariosService: UsuariosService,
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
      throw new ConflictException(`Ya existe el tipo ${createTipoDto.nombre}`);
    }

    return this.tipoRepository.save(createTipoDto);
  }

  findAll(usuario: JwtPayload) {
    if (usuario.rol === Rol.DOCTOR) {
      return this.pokemonRepository.find({ relations: { types: true } });
    }

    return this.pokemonRepository.find({
      where: { propietarios: { id: usuario.sub } },
      relations: { types: true },
    });
  }

  async findOne(id: number, usuario: JwtPayload) {
    const pokemon = await this.getPokemonOrFail(id);

    const esPropietario = pokemon.propietarios.some(
      (propietario) => propietario.id === usuario.sub,
    );

    if (usuario.rol !== Rol.DOCTOR && !esPropietario) {
      throw new NotFoundException(`No existe el pokemon con id ${id}`);
    }

    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const { tipos: tipoIds, ...datos } = updatePokemonDto;
    const pokemon = await this.getPokemonOrFail(id);

    if (tipoIds !== undefined) {
      pokemon.types = await this.resolverTipos(tipoIds);
    }

    this.pokemonRepository.merge(pokemon, datos);

    return this.pokemonRepository.save(pokemon);
  }

  async remove(id: number) {
    const pokemon = await this.getPokemonOrFail(id);

    await this.pokemonRepository.remove(pokemon);

    return { message: `Pokemon con id ${id} eliminado` };
  }

  async capturar(id: number, usuarioId: number) {
    const usuario = await this.usuariosService.findById(usuarioId);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const pokemon = await this.getPokemonWithPropietariosOrFail(id);

    const yaEsPropietario = pokemon.propietarios.some(
      (propietario) => propietario.id === usuarioId,
    );

    if (yaEsPropietario) {
      throw new ConflictException(`El pokemon con id ${id} ya te pertenece`);
    }

    pokemon.propietarios.push(usuario);
    await this.pokemonRepository.save(pokemon);

    return { message: `Pokemon con id ${id} capturado` };
  }

  async liberar(id: number, usuarioId: number) {
    const pokemon = await this.getPokemonWithPropietariosOrFail(id);

    const indice = pokemon.propietarios.findIndex(
      (propietario) => propietario.id === usuarioId,
    );

    if (indice === -1) {
      throw new NotFoundException(`El pokemon con id ${id} no te pertenece`);
    }

    pokemon.propietarios.splice(indice, 1);
    await this.pokemonRepository.save(pokemon);

    return { message: `Pokemon con id ${id} liberado` };
  }

  private async getPokemonOrFail(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: { types: true, propietarios: true },
    });

    if (!pokemon) {
      throw new NotFoundException(`No existe el pokemon con id ${id}`);
    }

    return pokemon;
  }

  private async getPokemonWithPropietariosOrFail(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: { propietarios: true },
    });

    if (!pokemon) {
      throw new NotFoundException(`No existe el pokemon con id ${id}`);
    }

    return pokemon;
  }

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
