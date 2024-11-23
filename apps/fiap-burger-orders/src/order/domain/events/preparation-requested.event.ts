import { DomainEvent } from '@fiap-burger/tactical-design/core';

export class PreparationRequested extends DomainEvent {
  public readonly requestedAt = new Date();

  constructor(public readonly preparationId: string) {
    super();
  }
}
