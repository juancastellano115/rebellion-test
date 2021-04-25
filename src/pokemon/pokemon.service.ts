import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as PokeList from './pokeData/data.json';
import axios, { AxiosResponse } from 'axios';
import { Parser } from 'json2csv';
import {
  PokemonBasicData,
  PokemonProperties,
  PokemonReturnData,
} from './interfaces/pokemon.interfaces';
import { PokeapiService } from './pokeapi.service';
import * as fs from 'fs';
//import { request, gql } from 'graphql-request';

@Injectable()
export class PokemonService {
  constructor(private pokeapiService: PokeapiService) {}
  /**
   * This function performs a partial text search and returns
   * base_experience, height and weight from every pokemon found
   * E.g. input: char --> charmander, charizard...
   * @param name name to search
   * @returns search results
   */
  async findByName(name: string): Promise<PokemonReturnData> {
    //search through the pokemon data we have
    const resultsJSON = PokeList.results.filter((pokemon: PokemonBasicData) =>
      pokemon.name.includes(name),
    );
    //if nothing found return 404
    if (resultsJSON.length === 0) {
      throw new NotFoundException('Pokemon was not found');
    }
    //stack the results from search into promises
    const promises: Promise<AxiosResponse>[] = resultsJSON.map(
      (pokemon) =>
        new Promise(async (resolve) => {
          resolve(this.pokeapiService.getPokemon(pokemon.name));
        }),
    );
    try {
      //fetch single pokemon data through promise.all for performance
      const responses: AxiosResponse[] = await Promise.all(promises);
      //normalize properties from request
      const results = this.normalizePokemonData(responses);
      //return the desired data
      return { count: resultsJSON.length, results };
    } catch (error) {
      throw new BadRequestException(
        'The external server could not be reached properly',
      );
    }
  }
  /**
   * This function searchs for color-specific pokemons
   * and returns them in a CSV format
   * @param color the color to search
   * @returns CSV
   */
  async getCSV(color: string): Promise<string> {
    /*
     // GRAPHQL APPROACH
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
    //make the request to the GQL endpoint
    const { pokemon_v2_pokemoncolor } = await request(
      'https://beta.pokeapi.co/graphql/v1beta',
      query,
    ).catch(() => {
      throw new BadRequestException(
        'The external server could not be reached properly',
      );
    });

    //normalize the data from the response body
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

    // TRADITIONAL APPROACH
    //get the specified color data
    const {
      data: { pokemon_species },
    } = await this.pokeapiService.getPokemonsByColor(color).catch(() => {
      throw new BadRequestException(
        'The external server could not be reached properly',
      );
    });

    const promises: Promise<AxiosResponse>[] = pokemon_species.map(
      (pokemon: PokemonBasicData) =>
        new Promise(async (resolve) => {
          //array destructuring to get only the pokemon ID through regex
          const [, pokemonNumber] = pokemon.url.match(/(\d+)/g);
          resolve(this.pokeapiService.getPokemon(pokemonNumber));
        }),
    );
    //Use threading to execute all the promises at once
    const responses: AxiosResponse[] = await Promise.all(promises).catch(() => {
      throw new BadRequestException(
        'The external server could not be reached properly',
      );
    });
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
  /**
   * this function extracts the most
   * important data from the API fetch
   * @param responses
   * @returns base experience, weight, height and name
   */
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

  private readonly path = './src/pokemon/pokedata/data.json';
  loadPokeData() {
    try {
      //We proceed to update the pokemon data from the API
      if (fs.existsSync(this.path)) {
        //this self invoking function is meant to use async/await in the controller constructor
        (async () => {
          //we use limit -1 to retrieve ALL pokemons
          const { data } = await axios.get(
            'https://pokeapi.co/api/v2/pokemon?limit=-1',
          );
          fs.writeFile(this.path, JSON.stringify(data), () => {
            console.log(`Pokedata updated`);
          });
        })();
      } else {
        throw new Error("PokeData doesn't exist");
      }
    } catch (error) {
      console.log('Pokedata update has failed');
    }
  }
}
