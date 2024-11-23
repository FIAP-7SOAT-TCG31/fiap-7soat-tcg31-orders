import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderRepository } from '../abstractions/order.repository';
import { PreparationService } from '../abstractions/preparation.service';
import { RequestOrderPreparationCommand } from './request-order-preparation.command';

@CommandHandler(RequestOrderPreparationCommand)
export class RequestOrderPreparationHandler
  implements ICommandHandler<RequestOrderPreparationCommand, void>
{
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly preparationService: PreparationService,
  ) {}

  async execute(command: RequestOrderPreparationCommand): Promise<void> {
    const { paymentId } = command;

    const order = await this.orderRepository.findByPaymentId(paymentId);

    if (!order) {
      throw new NotFoundException();
    }

    const { conciliationId } = await this.preparationService.requestPreparation(
      order.id,
      order.items,
    );

    order.requestPreparation(conciliationId);

    await this.orderRepository.update(order);
    await order.commit();
  }
}
