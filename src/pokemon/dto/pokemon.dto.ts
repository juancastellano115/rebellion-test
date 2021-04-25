import { IsEnum, IsNotEmpty } from 'class-validator';

export class findByNameDto {
  @IsNotEmpty()
  name: string;
}

export class getCSVDto {
  @IsNotEmpty()
  @IsEnum([
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
  ])
  color: string;
}
