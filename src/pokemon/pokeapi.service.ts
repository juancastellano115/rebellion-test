import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PokeapiService {
  /**
   * 
   * @param id accepts pokemon numeric ID or name
   */
  async getPokemon(id: number | string) {
    return await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }

  /**
   * 
   * @param color accepts a color e.g. "Yellow"
   */
  async getPokemonsByColor(color: string) {
    return await axios.get(`https://pokeapi.co/api/v2/pokemon-color/${color}`);
  }
}
