import { EntitySchemaFactory } from '@fiap-burger/tactical-design/core';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Order } from '../../../../domain/order.aggregate';
import { OrderItem } from '../../../../domain/values/order-item.value';
import { OrderStatus } from '../../../../domain/values/order-status.value';
import { Requester } from '../../../../domain/values/requester.value';
import { MongooseOrderSchema } from './order.schema';

@Injectable()
export class MongooseOrderSchemaFactory
  implements EntitySchemaFactory<MongooseOrderSchema, Order>
{
  entityToSchema(entity: Order): MongooseOrderSchema {
    const requester = entity.requester
      ? {
          name: entity.requester.name,
          cpf: entity.requester.cpf,
          email: entity.requester.email,
        }
      : null;
    return {
      _id: new Types.ObjectId(entity.id),
      items: entity.items.map((x) => ({ ...x })),
      requester,
      total: entity.total,
      status: entity.status,
    };
  }

  schemaToEntity(entitySchema: MongooseOrderSchema): Order {
    return new Order(
      entitySchema._id.toHexString(),
      entitySchema.requester
        ? new Requester(
            entitySchema.requester.name,
            entitySchema.requester.cpf,
            entitySchema.requester.email,
          )
        : null,
      OrderStatus.create(entitySchema.status),
      entitySchema.total,
      entitySchema.items.map((x) => new OrderItem(x.key, x.name, x.price)),
    );
  }
}
