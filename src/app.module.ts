import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonService } from './pokemon/pokemon.service';
import { PokeapiService } from './pokemon/pokeapi.service';

@Module({
  imports: [],
  controllers: [AppController, PokemonController],
  providers: [AppService, PokemonService, PokeapiService],
})
export class AppModule {}
