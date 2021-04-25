import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello Rebellion Pay!');
  });

  it('/pokemon/findByName (POST)', () => {
    return request(app.getHttpServer())
      .post('/pokemon/findByName')
      .send({ name: 'PIKa chu' })
      .expect(200)
  });

  it('/pokemon/csv/yellow (GET)', () => {
    return request(app.getHttpServer())
      .get('/pokemon/csv/yellow')
      .expect('Content-Type', /csv/)
      .expect(200)
  });
});
