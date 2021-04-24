import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class TrimLowerPipe implements PipeTransform<string> {
  transform(value: string): string {
    let result = value.replace(/\s/g, "")
    result = result.toLowerCase();
    return result;
  }
}
