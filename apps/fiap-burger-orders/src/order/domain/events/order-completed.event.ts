import { DomainEvent } from '@fiap-burger/tactical-design/core';

export class OrderCompleted extends DomainEvent {
  public readonly completedAt = new Date();
}
