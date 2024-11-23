import { TransactionManager } from '@fiap-burger/tactical-design/core';
import {
  FakeRepository,
  FakeTransactionManager,
} from '@fiap-burger/test-factory/utils';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Item } from '../../../domain/item.entity';
import { Order } from '../../../domain/order.aggregate';
import { OrderStatus } from '../../../domain/values/order-status.value';
import { OrderRepository } from '../abstractions/order.repository';
import { CompleteOrderOnPreparationCompletedCommand } from './complete-order-on-preparation-completed.command';
import { CompleteOrderOnPreparationCompletedHandler } from './complete-order-on-preparation-completed.handler';

describe('CompleteOrderOnPreparationCompletedHandler', () => {
  let app: INestApplication;
  let target: CompleteOrderOnPreparationCompletedHandler;
  let orderRepository: OrderRepository;

  const itemPrice = 19.9;
  const createItem = (id: string = randomUUID()) =>
    new Item(
      id,
      'X-Burger',
      itemPrice,
      'Snack',
      'I would like to buy a hamburger',
    );

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CompleteOrderOnPreparationCompletedHandler,
        {
          provide: TransactionManager,
          useClass: FakeTransactionManager,
        },
        {
          provide: OrderRepository,
          useClass: FakeRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    target = app.get(CompleteOrderOnPreparationCompletedHandler);
    orderRepository = app.get(OrderRepository);

    orderRepository.findByPreparationId = jest.fn();
  });

  it('should throw NotFoundException when Order does not exist', async () => {
    jest.spyOn(orderRepository, 'findByPreparationId').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'update');
    const command = new CompleteOrderOnPreparationCompletedCommand('123');
    await expect(() => target.execute(command)).rejects.toThrow(
      NotFoundException,
    );
    expect(orderRepository.update).not.toHaveBeenCalled();
  });

  it('should complete order', async () => {
    const order = new Order(randomUUID(), null, OrderStatus.initiate());
    order.addItem(createItem());
    order.checkout(randomUUID(), randomUUID());
    order.requestPreparation('');
    jest.spyOn(order, 'complete');
    jest.spyOn(orderRepository, 'findByPreparationId').mockResolvedValue(order);
    jest.spyOn(orderRepository, 'update').mockResolvedValue();
    const command = new CompleteOrderOnPreparationCompletedCommand(
      order.paymentId,
    );
    await target.execute(command);
    expect(orderRepository.update).toHaveBeenCalled();
    expect(order.complete).toHaveBeenCalled();
  });
});
