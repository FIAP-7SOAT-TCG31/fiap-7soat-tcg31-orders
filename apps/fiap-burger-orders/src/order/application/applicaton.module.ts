import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfraModule } from '../infra/infra.module';
import { CreateItemHandler } from './item/commands/create-item.handler';
import { UpdateItemHandler } from './item/commands/update-item.handler';
import { FindItemsHandler } from './item/queries/find-items.handler';
import { GetItemByIdHandler } from './item/queries/get-item-by-id.handler';
import { AddItemsToOrderHandler } from './order/commands/add-items-to-order.handler';
import { CheckoutOrderHandler } from './order/commands/checkout-order.handler';
import { CreateOrderHandler } from './order/commands/create-order.handler';
import { RemoveItemsFromOrderHandler } from './order/commands/remove-items-from-order.handler';
import { RequestOrderPreparationOnPaymentApprovedHandler } from './order/commands/request-order-preparation-on-payment-approved.handler';
import { GetOrderByIdHandler } from './order/queries/get-order-by-id.handler';

const QueryHandlers = [
  GetItemByIdHandler,
  FindItemsHandler,
  GetOrderByIdHandler,
];
const CommandHandlers = [
  CreateItemHandler,
  UpdateItemHandler,
  CreateOrderHandler,
  AddItemsToOrderHandler,
  RemoveItemsFromOrderHandler,
  CheckoutOrderHandler,
  RequestOrderPreparationOnPaymentApprovedHandler,
];

@Module({
  imports: [CqrsModule, InfraModule],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class ApplicationModule {}
