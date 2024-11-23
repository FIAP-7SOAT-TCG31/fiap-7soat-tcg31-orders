import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderRepository } from '../abstractions/order.repository';
import { CompleteOrderOnPreparationCompletedCommand } from './complete-order-on-preparation-completed.command';

@CommandHandler(CompleteOrderOnPreparationCompletedCommand)
export class CompleteOrderOnPreparationCompletedHandler
  implements ICommandHandler<CompleteOrderOnPreparationCompletedCommand, void>
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    command: CompleteOrderOnPreparationCompletedCommand,
  ): Promise<void> {
    const { preparationId } = command;

    const order = await this.orderRepository.findByPreparationId(preparationId);

    if (!order) {
      throw new NotFoundException();
    }

    order.complete();

    await this.orderRepository.update(order);
    await order.commit();
  }
}
