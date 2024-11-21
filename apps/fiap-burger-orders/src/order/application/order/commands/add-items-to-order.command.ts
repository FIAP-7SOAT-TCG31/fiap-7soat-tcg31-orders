import { AddItemsToOrderInput } from '../dtos/add-items-to-order.input.ts.js';

export class AddItemsToOrderCommand {
  constructor(public readonly data: AddItemsToOrderInput) {}
}
