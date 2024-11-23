import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { randomUUID } from 'crypto';
import { FiapBurgerPreparationService } from './fiap-burger-preparation.service';

describe('MongooseFiapBurgerPreparationService', () => {
  let app: INestApplication;
  let target: FiapBurgerPreparationService;
  let config: ConfigService;
  let http: HttpService;
  let axios: AxiosInstance;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        FiapBurgerPreparationService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn(), getOrThrow: jest.fn() },
        },
        {
          provide: HttpService,
          useValue: { axiosRef: { post: jest.fn(), get: jest.fn() } },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(FiapBurgerPreparationService);
    config = app.get(ConfigService);
    http = app.get(HttpService);
    axios = http.axiosRef;
  });

  it('should instantiate correctly', async () => {
    expect(target).toBeInstanceOf(FiapBurgerPreparationService);
  });

  it('should throw if config service throws', async () => {
    jest.spyOn(config, 'getOrThrow').mockImplementation(() => {
      throw new Error();
    });
    await expect(() =>
      target.requestPreparation(randomUUID(), []),
    ).rejects.toThrow();
  });

  it('should throw if http service throws', async () => {
    jest.spyOn(config, 'getOrThrow').mockReturnValue(faker.internet.url());
    jest.spyOn(axios, 'post').mockRejectedValue(new Error());
    await expect(() =>
      target.requestPreparation(randomUUID(), []),
    ).rejects.toThrow();
  });

  it('should create creparation and return its content', async () => {
    jest.spyOn(config, 'getOrThrow').mockReturnValue(faker.internet.url());
    const id = randomUUID();
    jest.spyOn(axios, 'post').mockResolvedValue({ data: { id } });
    const result = await target.requestPreparation(randomUUID(), []);
    expect(result.conciliationId).toBe(id);
  });
});
