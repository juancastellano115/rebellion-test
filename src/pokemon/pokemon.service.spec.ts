import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { PokeapiService } from './pokeapi.service';
import { BadRequestException } from '@nestjs/common';
/**
 * This class is for mocking the service,
 * This means that we "fake" the API calls
 * in order to not be calling the API when we execute the tests
 */
class PokeApiServiceMock {
  getPokemon(id: number | string) {
    return new Promise((resolve) =>
      resolve({
        data: { name: 'pikachu', base_experience: 112, weight: 60, height: 4 },
      }),
    );
  }
  getPokemonsByColor(color: string) {
    const colors = [
      'blue',
      'black',
      'brown',
      'gray',
      'green',
      'pink',
      'purple',
      'red',
      'white',
      'yellow',
    ];
    if (!colors.includes(color)) {
      throw new BadRequestException(
        'Failed to get color data',
      );
    }
    return new Promise((resolve) =>
      resolve({
        data: {
          pokemon_species: [
            {
              name: 'pikachu',
              url: 'https://pokeapi.co/api/v2/pokemon-species/25/',
            },
          ],
        },
      }),
    );
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

    it('should return an array longer than zero', async () => {
      const result = await service.findByName('pikachu');
      expect(result.results.length).toBeGreaterThan(0);
    });

    it('should return non null values', async () => {
      const result = await service.findByName('pikachu');
      expect(result.results).not.toEqual(null);
    });

    it('should return 404 exception', async () => {
      await expect(service.findByName('pekachung')).rejects.toThrow(
        'Pokemon was not found',
      );
    });
  });

  describe('getCSV', () => {
    it('should return a CSV string', async () => {
      expect(typeof (await service.getCSV('yellow'))).toBe('string');
    });

    it('should not return null', async () => {
      expect(typeof (await service.getCSV('yellow'))).not.toEqual(null);
    });

    it('should return 400 exception', async () => {
      await expect(service.getCSV('magenta')).rejects.toThrow(
        'Failed to get color data',
      );
    });
  });
});
