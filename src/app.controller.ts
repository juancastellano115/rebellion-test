import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  //we'll keep this route for the microservice healthckeck
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
