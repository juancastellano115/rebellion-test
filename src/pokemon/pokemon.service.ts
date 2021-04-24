import { Injectable } from '@nestjs/common';
import * as PokeList from './pokeData/data.json';
import axios from 'axios';
import {
  PokemonBasicData,
  PokemonProperties,
  PokemonReturnData,
} from './interfaces/pokemon.interfaces';

@Injectable()
export class PokemonService {
  async findByName(name: string): Promise<PokemonReturnData> {
    const resultsJSON = PokeList.results.filter((pokemon: PokemonBasicData) =>
      pokemon.name.includes(name),
    );
    const promises = resultsJSON.map(
      (pokemon) =>
        new Promise(async (resolve) => {
          resolve(
            await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
            ),
          );
        }),
    );
    const responses = await Promise.all(promises);
    const results: PokemonProperties[] = responses.map(
      ({ data: { base_experience, name, weight, height } }) => ({
        base_experience,
        name,
        weight,
        height,
      }),
    );

    return { count: resultsJSON.length, results };
  }

  getCSV(color: string): string {
    return color;
  }
}
