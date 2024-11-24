import { createTestApp as baseCreateTestApp } from '@fiap-burger/test-factory/utils';
import { AppModule } from '../src/app.module';

export const env = {
  APP_NAME: 'fiap-burger-orders-test-app',
  APP_DESCRIPTION: 'Orders Component for Fiap Burger',
  APP_VERSION: '1.0.0',
  BASE_URL_PAYMENT_SERVICE: 'http://localhost:4000',
  BASE_URL_PREPARATION_SERVICE: 'http://localhost:5000',
  EXTRA_EXCHANGES: 'fiap.burger.payments.events;fiap.burger.preparation.events',
};

export const createTestApp = (silentLogger: boolean = true) =>
  baseCreateTestApp(AppModule, { env, silentLogger });
