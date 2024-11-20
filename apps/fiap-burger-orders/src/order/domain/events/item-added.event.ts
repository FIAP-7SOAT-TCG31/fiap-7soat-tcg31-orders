import { DomainEvent } from '@fiap-burger/tactical-design/core';
import { Item } from '../item.entity';

export class ItemAdded extends DomainEvent {
  public readonly addedAt = new Date();

  constructor(public readonly item: Item) {
    super();
  }
}
