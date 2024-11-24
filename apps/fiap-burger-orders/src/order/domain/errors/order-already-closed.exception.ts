import { DomainException } from '@fiap-burger/tactical-design/core';

export class OrderAlreadyInAdvancedStatus extends DomainException {
  constructor() {
    super(`The specified order is already at an advanced status for operation`);
  }
}