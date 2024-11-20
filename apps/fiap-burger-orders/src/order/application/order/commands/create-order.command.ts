import { CreateOrderInput } from '../dtos/create-order.input';

export class CreateOrderCommand {
  constructor(public readonly data: CreateOrderInput) {}
}

export class CreateOrderResult {
  constructor(public readonly id: string) {}
}
