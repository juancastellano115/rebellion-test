export interface PokemonBasicData {
  name: string;
  url: string;
}

export interface PokemonReturnData {
  count: number;
  results: Array<PokemonProperties>;
}

export interface PokemonProperties {
  name: string;
  base_experience: number;
  weight: number;
  height: number;
}