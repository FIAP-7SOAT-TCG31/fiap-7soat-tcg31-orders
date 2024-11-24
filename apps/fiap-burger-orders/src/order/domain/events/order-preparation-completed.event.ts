import { DomainEvent } from '@fiap-burger/tactical-design/core';

export class OrderPreparationCompleted extends DomainEvent {
  public readonly completedAt = new Date();
}
