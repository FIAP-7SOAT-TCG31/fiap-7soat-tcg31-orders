import { AmqpRetrialPolicy, AmqpSubscription } from '@fiap-burger/amqp';
import { routingKeyOfEvent } from '@fiap-burger/tactical-design/amqp';
import { Body, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { withPrefix } from '../../../config/amqp.config';
import { CompleteOrderOnPreparationCompletedCommand } from '../../application/order/commands/complete-order-on-preparation-completed.command';
import { PreparationCompleted } from '../../application/order/dtos/preparation-completed.integration-event';

@Injectable()
export class OnPreparationCompletedCompleteOrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @AmqpSubscription({
    exchange: 'fiap.burger.preparation.events',
    routingKey: routingKeyOfEvent(PreparationCompleted),
    queue: withPrefix(CompleteOrderOnPreparationCompletedCommand.name),
  })
  @AmqpRetrialPolicy({
    delay: 5000,
    maxDelay: 5,
    maxAttempts: 5,
  })
  async execute(@Body() data: PreparationCompleted) {
    const paymentId = data.aggregateId;
    await this.commandBus.execute(
      new CompleteOrderOnPreparationCompletedCommand(paymentId),
    );
  }
}
