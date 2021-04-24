import { Injectable } from '@nestjs/common';
import * as PokeList from './pokeData/data.json';
import axios from 'axios';
import { Parser } from 'json2csv';
import {
  PokemonBasicData,
  PokemonProperties,
  PokemonReturnData,
} from './interfaces/pokemon.interfaces';
import { request, gql } from 'graphql-request';

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

  async getCSV(color: string): Promise<string> {
    const query = gql`
    {
      pokemon_v2_pokemoncolor(where: { name: { _eq: "${color}" } }) {
        pokemon_v2_pokemonspecies {
          pokemon_v2_pokemons {
            height
            name
            weight
            base_experience
          }
        }
      }
    }
  `;
    const { pokemon_v2_pokemoncolor } = await request(
      'https://beta.pokeapi.co/graphql/v1beta',
      query,
    );

    const extractedData = pokemon_v2_pokemoncolor[0].pokemon_v2_pokemonspecies;
    const normalizedData = [];

    for (const species of extractedData) {
      for (const key in species) {
        if (Object.prototype.hasOwnProperty.call(species, key)) {
          const element = species['pokemon_v2_pokemons'];
          for (const pokemon of element) {
            normalizedData.push(pokemon);
          }
        }
      }
    }
    const sortedData = normalizedData.sort((a, b) => a.base_experience - b.base_experience)
    //CONVERT TO CSV
    const fields = ['name', 'base_experience', 'height', 'weight'];
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(sortedData);

    return csv;
  }
}
