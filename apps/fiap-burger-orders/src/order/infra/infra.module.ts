import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemRepository } from '../application/item/abstractions/item.repository';
import { OrderRepository } from '../application/order/abstractions/order.repository';
import { MongooseItemSchemaFactory } from './persistance/mongoose/item/item-schema.factory';
import { MongooseItemRepository } from './persistance/mongoose/item/item.repository';
import {
  MongooseItemSchema,
  MongooseItemSchemaModel,
} from './persistance/mongoose/item/item.schema';
import { MongooseOrderSchemaFactory } from './persistance/mongoose/order/order-schema.factory';
import { MongooseOrderRepository } from './persistance/mongoose/order/order.repository';
import {
  MongooseOrderSchema,
  MongooseOrderSchemaModel,
} from './persistance/mongoose/order/order.schema';

const MongooseSchemaModule = MongooseModule.forFeature([
  {
    name: MongooseItemSchema.name,
    schema: MongooseItemSchemaModel,
  },
  {
    name: MongooseOrderSchema.name,
    schema: MongooseOrderSchemaModel,
  },
]);

MongooseSchemaModule.global = true;

@Module({
  imports: [MongooseSchemaModule],
  providers: [
    MongooseItemSchemaFactory,
    {
      provide: ItemRepository,
      useClass: MongooseItemRepository,
    },
    MongooseOrderSchemaFactory,
    {
      provide: OrderRepository,
      useClass: MongooseOrderRepository,
    },
  ],
  exports: [ItemRepository, OrderRepository],
})
export class InfraModule {}
