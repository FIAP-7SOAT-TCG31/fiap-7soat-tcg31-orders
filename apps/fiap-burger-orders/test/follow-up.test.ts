import { AmqpService } from '@fiap-burger/amqp';
import { toDottedNotation } from '@fiap-burger/tactical-design/amqp';
import { AggregateEvent } from '@fiap-burger/tactical-design/core';
import { destroyTestApp } from '@fiap-burger/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setTimeout } from 'timers/promises';
import { Order } from '../src/order/application/order/dtos/order.dto';
import { PaymentApproved } from '../src/order/application/order/dtos/payment-approved.integration-event';
import { PreparationCompleted } from '../src/order/application/order/dtos/preparation-completed.integration-event';
import { PreparationStarted } from '../src/order/application/order/dtos/preparation-started.integration-event';
import {
  createMockService,
  createTestApp,
  destroyMockService,
} from './create-app';
import { populateItems } from './create-items';

const basePath = '/v1/orders-follow-up';
const baseOrdersPath = '/v1/orders';
const exchanges = {
  payments: 'fiap.burger.payments.events',
  preparation: 'fiap.burger.preparation.events',
};

describe('FollowUp', () => {
  let app: INestApplication;
  let server: App;

  let items: { id: string }[];

  const getOrder = async (id: string): Promise<Order> => {
    const response = await request(server).get(`${baseOrdersPath}/${id}`);
    return response.body;
  };

  const createOrder = async (): Promise<string> => {
    const response = await request(server).post(baseOrdersPath).send({ items });
    return response.body.id;
  };

  const checkoutOrder = async (id: string) => {
    await request(server).post(`${baseOrdersPath}/${id}/checkout`);
  };

  const publishAggregateEvent = async (
    aggregateId: string,
    eventName: string,
    exchange: string,
  ) => {
    const aggregateEvent = new AggregateEvent(
      randomUUID(),
      aggregateId,
      eventName,
      new Date(),
      1,
      {},
    );

    const amqp = app.get(AmqpService);
    await amqp.publish(exchange, toDottedNotation(eventName), aggregateEvent);
    await setTimeout(100);
  };

  const publishPaymentApproved = async (aggregateId: string) => {
    await publishAggregateEvent(
      aggregateId,
      PaymentApproved.name,
      exchanges.payments,
    );
  };

  const publishPreparationStarted = async (aggregateId: string) => {
    await publishAggregateEvent(
      aggregateId,
      PreparationStarted.name,
      exchanges.preparation,
    );
  };

  const publishPreparationCompleted = async (aggregateId: string) => {
    await publishAggregateEvent(
      aggregateId,
      PreparationCompleted.name,
      exchanges.preparation,
    );
  };

  const createReceivedOrder = async () => {
    const orderId = await createOrder();
    await checkoutOrder(orderId);
    const { paymentId } = await getOrder(orderId);
    await publishPaymentApproved(paymentId);
    return orderId;
  };
  const createStartedOrder = async () => {
    const orderId = await createOrder();
    await checkoutOrder(orderId);
    const { paymentId } = await getOrder(orderId);
    await publishPaymentApproved(paymentId);
    const { preparationId } = await getOrder(orderId);
    await publishPreparationStarted(preparationId);
    return orderId;
  };
  const createReadyOrder = async () => {
    const orderId = await createOrder();
    await checkoutOrder(orderId);
    const { paymentId } = await getOrder(orderId);
    await publishPaymentApproved(paymentId);
    const { preparationId } = await getOrder(orderId);
    await publishPreparationStarted(preparationId);
    await publishPreparationCompleted(preparationId);
    return orderId;
  };

  beforeAll(async () => {
    createMockService();
    app = await createTestApp();
    server = app.getHttpServer();
    await populateItems(server);
    const getItemsResponse = await request(server).get(`/v1/items`);
    items = getItemsResponse.body.data
      .slice(0, 3)
      .map((x: any) => ({ id: x.id }));
  });

  afterAll(async () => {
    await destroyTestApp(app);
    destroyMockService();
  });

  describe('GET /v1/orders-follow-up', () => {
    jest.setTimeout(20000);
    it('should return create a oders grouped by their statuses', async () => {
      const receivedOrders = await Promise.all(
        Array(3)
          .fill(null)
          .map(() => createReceivedOrder()),
      );
      const startedOrders = await Promise.all(
        Array(3)
          .fill(null)
          .map(() => createStartedOrder()),
      );
      const readyOrders = await Promise.all(
        Array(3)
          .fill(null)
          .map(() => createReadyOrder()),
      );

      const followUpResponse = await request(server).get(basePath);
      const { statusCode, body } = followUpResponse;
      expect(statusCode).toBe(200);
      expect(body.ready).toHaveLength(readyOrders.length);
      expect(body.started).toHaveLength(startedOrders.length);
      expect(body.received).toHaveLength(receivedOrders.length);
    });
  });
});
