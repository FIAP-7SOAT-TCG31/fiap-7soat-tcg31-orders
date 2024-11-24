import { items } from '@fiap-burger/test-factory/utils';
import * as request from 'supertest';
import { App } from 'supertest/types';

export const populateItems = async (app: App) => {
  for (const item of items) {
    await request(app).post('/v1/items').send(item);
  }
};
