import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
/**
 * This class takes an object and transforms its string properties to lowercase
 * and takes out the white spaces
 */
export class TrimLowerPipe implements PipeTransform<Object> {
  transform(values: Object): Object {
    if (!values) {
      throw new BadRequestException('Validation failed');
    }
    //loop over the values of the object
    for (const key in values) {
      try {
        let result = values[key].replace(/\s/g, '');
        result = result.toLowerCase();
        values[key] = result;
      } catch (error) {
        throw new BadRequestException('Only strings are allowed');
      }
    }

    return values;
  }
}
