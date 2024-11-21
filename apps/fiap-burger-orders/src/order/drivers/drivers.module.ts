import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/applicaton.module';
import { CreateItemController } from './item/create-item.controller';
import { FindItemsController } from './item/find-items.controller';
import { GetItemByIdController } from './item/get-item-by-id.controller';
import { UpdateItemController } from './item/update-item.controller';
import { CreateOrderController } from './order/create-order.controller';

const HttpDrivers = [
  CreateItemController,
  GetItemByIdController,
  UpdateItemController,
  FindItemsController,
  CreateOrderController,
];
const AmqpDrivers = [];

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [...HttpDrivers],
  providers: [...AmqpDrivers],
})
export class DriversModule {}
