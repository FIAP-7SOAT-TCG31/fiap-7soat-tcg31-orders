import { DomainEvent } from '@fiap-burger/tactical-design/core';
import { OrderItem } from '../values/order-item.value';

export class ItemRemoved extends DomainEvent {
  public readonly removedAt = new Date();

  constructor(public readonly item: OrderItem) {
    super();
  }
}
