import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WaitTimeCalculator } from '../../../domain/services/wait-time.calculator';
import { EOrderStatus } from '../../../domain/values/order-status.value';
import { MongooseOrderSchema } from '../../../infra/persistance/mongoose/order/order.schema';
import { OrderFollowUp } from '../dtos/follow-up.dto';
import {
  FollowUpOrdersQuery,
  FollowUpOrdersResult,
} from './follow-up-orders.query';

@QueryHandler(FollowUpOrdersQuery)
export class FollowUpOrdersHandler
  implements IQueryHandler<FollowUpOrdersQuery, FollowUpOrdersResult>
{
  constructor(
    @InjectModel(MongooseOrderSchema.name)
    private readonly queryModel: Model<MongooseOrderSchema>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: FollowUpOrdersQuery): Promise<FollowUpOrdersResult> {
    const result = await this.queryModel
      .find({
        status: [
          EOrderStatus.PreparationRequested, // Received
          // EOrderStatus.PreparationStarted, // Started
          EOrderStatus.PreparationCompleted, // Ready
        ],
      })
      .exec();

    if (!result) {
      return new FollowUpOrdersResult({});
    }

    const ready: OrderFollowUp[] = [];
    const started: OrderFollowUp[] = [];
    const received: OrderFollowUp[] = [];

    for (const order of result) {
      const orderGroup = {
        [EOrderStatus.PreparationCompleted]: ready,
        // [EOrderStatus.PreparationStarted]: started,
        [EOrderStatus.PreparationRequested]: ready,
      }[order.status];
      orderGroup.push(
        new OrderFollowUp({
          customer: order?.requester?.name ?? 'Unknown',
          orderId: order._id.toHexString(),
          // TODO: Should use order.requestedPreparationAt
          waitingTime: WaitTimeCalculator.calculate(order.createdAt),
        }),
      );
    }

    return new FollowUpOrdersResult({
      ...(ready.length ? { ready } : {}),
      ...(started.length ? { started } : {}),
      ...(received.length ? { received } : {}),
    });
  }
}
