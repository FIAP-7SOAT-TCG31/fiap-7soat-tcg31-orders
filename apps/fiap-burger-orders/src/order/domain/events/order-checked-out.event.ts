import { DomainEvent } from '@fiap-burger/tactical-design/core';

export class OrderCheckedOut extends DomainEvent {
  public readonly checkedOutAt = new Date();
}
