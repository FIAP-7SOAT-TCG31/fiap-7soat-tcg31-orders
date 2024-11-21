import { DomainEvent } from '@fiap-burger/tactical-design/core';

export class OrderCheckedOut extends DomainEvent {
  public readonly checkedOutAt = new Date();

  constructor(
    public readonly paymentId: string,
    public readonly qrCode: string,
  ) {
    super();
  }
}
