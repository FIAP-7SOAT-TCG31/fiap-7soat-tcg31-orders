import { DomainEvent } from '@fiap-burger/tactical-design/core';

export class OrderCreated extends DomainEvent {
  public readonly createdAt = new Date();
}
