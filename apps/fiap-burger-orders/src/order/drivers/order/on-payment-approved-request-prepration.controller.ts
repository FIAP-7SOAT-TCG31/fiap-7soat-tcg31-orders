import { AmqpRetrialPolicy, AmqpSubscription } from '@fiap-burger/amqp';
import { routingKeyOfEvent } from '@fiap-burger/tactical-design/amqp';
import { Body, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { withPrefix } from '../../../config/amqp.config';
import { RequestOrderPreparationCommand } from '../../application/order/commands/request-order-preparation.command';
import { PaymentApproved } from '../../application/order/dtos/payment-approved.integration-event';

@Injectable()
export class OnPaymentApprovedRequestPreparationController {
  constructor(private readonly commandBus: CommandBus) {}

  @AmqpSubscription({
    exchange: 'fiap.burger.payments.events',
    routingKey: routingKeyOfEvent(PaymentApproved),
    queue: withPrefix(RequestOrderPreparationCommand.name),
  })
  @AmqpRetrialPolicy({
    delay: 5000,
    maxDelay: 5,
    maxAttempts: 5,
  })
  async execute(@Body() data: PaymentApproved) {
    const paymentId = data.aggregateId;
    await this.commandBus.execute(
      new RequestOrderPreparationCommand(paymentId),
    );
  }
}
