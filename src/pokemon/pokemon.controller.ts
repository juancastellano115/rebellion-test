import { Controller, Post, Body, Get, Param, Res, Response, Header, HttpCode } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import * as fs from 'fs';
import axios from 'axios';
import { PokemonReturnData } from './interfaces/pokemon.interfaces';
import { TrimLowerPipe } from './pipes/trim-lower-pipe';
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
    @Body('name', new TrimLowerPipe()) name: string,
  ): Promise<PokemonReturnData> {
    return this.pokemonService.findByName(name);
  }

  @Get('/csv/:color')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=pokemons.csv')
  getCSV(@Param('color', new TrimLowerPipe()) color: string): Promise<string> {
    return this.pokemonService.getCSV(color);
  }
}
