import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Header,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonReturnData } from './interfaces/pokemon.interfaces';
import { TrimLowerPipe } from './pipes/trim-lower-pipe';
import { findByNameDto, getCSVDto } from './dto/pokemon.dto';
@Controller('pokemon')
export class PokemonController {
  /**
   * This constructor updates the pokedata.json in ./pokedata everytime the server comes up
   * this data will be used later in the service
   * @param pokemonService Injects our service in the controller
   */
  constructor(private readonly pokemonService: PokemonService) {
    pokemonService.loadPokeData();
  }

  @HttpCode(200)
  @Post('/findByName')
  findByName(
    @Body(new ValidationPipe(), new TrimLowerPipe())
    findByNameDto: findByNameDto,
  ): Promise<PokemonReturnData> {
    return this.pokemonService.findByName(findByNameDto.name);
  }

  @Get('/csv/:color')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=pokemons.csv')
  getCSV(
    @Param(new ValidationPipe(), new TrimLowerPipe()) getCSVDto: getCSVDto,
  ): Promise<string> {
    return this.pokemonService.getCSV(getCSVDto.color);
  }
}
