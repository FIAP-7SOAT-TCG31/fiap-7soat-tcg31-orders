import {
  DomainException,
  TransactionManager,
} from '@fiap-burger/tactical-design/core';
import {
  FakeRepository,
  FakeTransactionManager,
} from '@fiap-burger/test-factory/utils';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Item } from '../../../domain/item.entity';
import { Order } from '../../../domain/order.aggregate';
import {
  EOrderStatus,
  OrderStatus,
} from '../../../domain/values/order-status.value';
import { OrderRepository } from '../abstractions/order.repository';
import { CheckoutOrderCommand } from './checkout-order.command';
import { CheckoutOrderHandler } from './checkout-order.handler';

describe('CheckoutOrderHandler', () => {
  let app: INestApplication;
  let target: CheckoutOrderHandler;
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
        CheckoutOrderHandler,
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
    target = app.get(CheckoutOrderHandler);
    orderRepository = app.get(OrderRepository);
  });

  it('should throw NotFoundException when Order does not exist', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'update');
    const command = new CheckoutOrderCommand('123');
    await expect(() => target.execute(command)).rejects.toThrow(
      NotFoundException,
    );
    expect(orderRepository.update).not.toHaveBeenCalled();
  });

  it('should throw DomainException when Order has no items', async () => {
    const order = new Order(randomUUID(), null, OrderStatus.initiate());
    jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
    jest.spyOn(orderRepository, 'update');
    const command = new CheckoutOrderCommand('123');
    await expect(() => target.execute(command)).rejects.toThrow(
      DomainException,
    );
    expect(orderRepository.update).not.toHaveBeenCalled();
  });

  it('should checkout order appending paymentId', async () => {
    const order = new Order(randomUUID(), null, OrderStatus.initiate());
    order.addItem(createItem());
    jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
    jest.spyOn(orderRepository, 'update').mockResolvedValue();
    const command = new CheckoutOrderCommand('123');
    await target.execute(command);
    expect(orderRepository.update).toHaveBeenCalled();
    expect(order.status).toBe(EOrderStatus.Requested);
    expect(order.paymentId).toBeDefined();
  });
});
