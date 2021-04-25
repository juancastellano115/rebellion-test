import { Injectable } from '@nestjs/common';
import * as PokeList from './pokeData/data.json';
import axios, { AxiosResponse } from 'axios';
import { Parser } from 'json2csv';
import {
  PokemonBasicData,
  PokemonProperties,
  PokemonReturnData,
} from './interfaces/pokemon.interfaces';
import { PokeapiService } from './pokeapi.service';
//import { request, gql } from 'graphql-request';

@Injectable()
export class PokemonService {
  constructor(private pokeapiService: PokeapiService) {}

  async findByName(name: string): Promise<PokemonReturnData> {

    const resultsJSON = PokeList.results.filter((pokemon: PokemonBasicData) =>
      pokemon.name.includes(name),
    );
    const promises: Promise<AxiosResponse>[] = resultsJSON.map(
      (pokemon) =>
        new Promise(async (resolve) => {
          resolve(this.pokeapiService.getPokemon(pokemon.name));
        }),
    );
    const responses: AxiosResponse[] = await Promise.all(promises);
    const results = this.normalizePokemonData(responses);

    return { count: resultsJSON.length, results };
  }

  async getCSV(color: string): Promise<string> {
    /** 
     * GRAPHQL APPROACH
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
    */

    const {
      data: { pokemon_species },
    } = await this.pokeapiService.getPokemonsByColor(color);

    const promises: Promise<AxiosResponse>[] = pokemon_species.map(
      (pokemon: PokemonBasicData) =>
        new Promise(async (resolve) => {
          const [, pokemonNumber] = pokemon.url.match(/(\d+)/g);
          resolve(this.pokeapiService.getPokemon(pokemonNumber));
        }),
    );
    //Use threading to execute all the promises at once 
    const responses: AxiosResponse[] = await Promise.all(promises);
    //normalize the responses
    const normalizedData = this.normalizePokemonData(responses);
    //Sort by base_experience
    const sortedData = normalizedData.sort(
      (a, b) => a.base_experience - b.base_experience,
    );

    //Transform to CSV
    const fields = ['name', 'base_experience', 'height', 'weight'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(sortedData);

    return csv;
  }

  private normalizePokemonData(
    responses: AxiosResponse[],
  ): PokemonProperties[] {
    return responses.map(
      ({ data: { base_experience, name, weight, height } }) => ({
        base_experience,
        name,
        weight,
        height,
      }),
    );
  }
}
