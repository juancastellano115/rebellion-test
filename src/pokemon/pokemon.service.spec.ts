import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { PokeapiService } from './pokeapi.service';
/**
 * This class is for mocking the service,
 * This means that we "fake" the API calls
 * in order to not be calling the API when we execute the tests
 */
class PokeApiServiceMock {
  getPokemon(id: number | string) {
    return {
      data: { name: 'pikachu', base_experience: 112, weight: 60, height: 4 },
    };
  }
  getPokemonsByColor(color: string) {
    return {
      data: {
        pokemon_species: [
          {
            name: 'pikachu',
            url: 'https://pokeapi.co/api/v2/pokemon-species/25/',
          },
        ],
      },
    };
  }
}

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(async () => {
    //Mocking for PokeAPI
    const PokeApiServiceProvider = {
      provide: PokeapiService,
      useClass: PokeApiServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService, PokeApiServiceProvider],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByName', () => {

    it('should return an integer and an array', async () => {
      const result = await service.findByName('pikachu');
      expect(typeof result.count).toBe('number');
      expect(Array.isArray(result.results)).toBeTruthy();
    });

    it('should return an array longer than one', async () => {
      const result = await service.findByName('pikachu');
      expect(result.results.length).toBeGreaterThan(1);
    });

    it('should return non null values', async () => {
      const result = await service.findByName('pikachu');
      expect(result.results).not.toEqual(null);
    });

  });

  describe('getCSV', () => {

    it('should return a CSV string', async () => {
      expect(typeof (await service.getCSV('yellow'))).toBe('string');
    });

  });
});
