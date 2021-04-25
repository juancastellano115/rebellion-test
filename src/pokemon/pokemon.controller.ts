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
import * as fs from 'fs';
import axios from 'axios';
import { PokemonReturnData } from './interfaces/pokemon.interfaces';
import { TrimLowerPipe } from './pipes/trim-lower-pipe';
import { findByNameDto, getCSVDto } from './dto/pokemon.dto';
@Controller('pokemon')
export class PokemonController {
  private readonly path = './src/pokemon/pokedata/data.json';
  /**
   * This constructor checks if the pokemon data exists, if not,
   * it downloads it for a later use in the service
   * @param pokemonService Injects our service in the controller
   */
  constructor(private readonly pokemonService: PokemonService) {
    try {
      //if the pokemon data doesn't exists, we proceed to download it from the API
      if (!fs.existsSync(this.path)) {
        (async () => {
          const { data } = await axios.get(
            'https://pokeapi.co/api/v2/pokemon?limit=-1',
          );
          fs.writeFile(this.path, JSON.stringify(data), () => {
            console.log(`Pokedata downloaded`);
          });
        })();
      }
    } catch (error) {
      console.log(error);
    }
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
