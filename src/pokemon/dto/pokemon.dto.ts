import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum colors {
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
}

export class findByNameDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
export class getCSVDto {
  @IsNotEmpty()
  @IsEnum(colors)
  @ApiProperty({
    enum: colors,
  })
  color: string;
}
