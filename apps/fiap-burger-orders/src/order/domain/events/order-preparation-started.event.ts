import { DomainEvent } from '@fiap-burger/tactical-design/core';

export class OrderPreparationSarted extends DomainEvent {
  public readonly startedAt = new Date();
}
