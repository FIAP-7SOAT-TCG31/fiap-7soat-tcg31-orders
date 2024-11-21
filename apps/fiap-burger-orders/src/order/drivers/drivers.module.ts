import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/applicaton.module';
import { CreateItemController } from './item/create-item.controller';
import { FindItemsController } from './item/find-items.controller';
import { GetItemByIdController } from './item/get-item-by-id.controller';
import { UpdateItemController } from './item/update-item.controller';
import { AddItemsToOrderController } from './order/add-items-to-order.controller';
import { CreateOrderController } from './order/create-order.controller';
import { GetOrderByIdController } from './order/get-order-by-id.controller';
import { RemoveItemsFromOrderController } from './order/remove-items-from-order.controller';

const HttpDrivers = [
  CreateItemController,
  GetItemByIdController,
  UpdateItemController,
  FindItemsController,
  CreateOrderController,
  GetOrderByIdController,
  AddItemsToOrderController,
  RemoveItemsFromOrderController,
];
const AmqpDrivers = [];

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [...HttpDrivers],
  providers: [...AmqpDrivers],
})
export class DriversModule {}
