import { DomainException } from '@fiap-burger/tactical-design/core';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { OrderRepository } from '../abstractions/order.repository';
import { CheckoutOrderCommand } from './checkout-order.command';

@CommandHandler(CheckoutOrderCommand)
export class CheckoutOrderHandler
  implements ICommandHandler<CheckoutOrderCommand, void>
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({ id }: CheckoutOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException();
    }

    if (!order.items.length) {
      throw new DomainException('Order has no items');
    }

    const paymentId = randomUUID();
    order.checkout(paymentId);

    await this.orderRepository.update(order);
    await order.commit();
  }
}
