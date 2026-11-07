import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDto } from './create-tipo.dto.js';

export class UpdateTipoDto extends PartialType(CreateTipoDto) {}
