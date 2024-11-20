import { StatusTransitionException } from '../errors/status-transition.exception';

export enum EOrderStatus {
  Initiated = 'Initiated',
  Requested = 'Requested',
  WaitingPayment = 'WaitingPayment',
  InPreparation = 'InPreparation',
  ReadyForPickup = 'ReadyForPickup',
  Completed = 'Completed',
  PaymentRejected = 'PaymentRejected',
}

export type OrderStatusValues = `${EOrderStatus}`;

export abstract class OrderStatus {
  protected abstract readonly _value: OrderStatusValues;

  get value() {
    return this._value;
  }

  static create(value: OrderStatusValues): OrderStatus {
    const StatusMap: Record<OrderStatusValues, new () => OrderStatus> = {
      Initiated: InitiatedOrderStatus,
      Requested: RequestedOrderStatus,
      WaitingPayment: WaitingPaymentOrderStatus,
      InPreparation: InPreparationOrderStatus,
      ReadyForPickup: ReadyForPickupOrderStatus,
      Completed: CompletedOrderStatus,
      PaymentRejected: PaymentRejectedOrderStatus,
    };

    const Status = StatusMap[value];

    return new Status();
  }

  static initiate() {
    return OrderStatus.create('Initiated');
  }

  initiate(): OrderStatus {
    throw new StatusTransitionException(this._value, EOrderStatus.Initiated);
  }

  request(): OrderStatus {
    throw new StatusTransitionException(this._value, EOrderStatus.Requested);
  }

  waitPayment(): OrderStatus {
    throw new StatusTransitionException(
      this._value,
      EOrderStatus.WaitingPayment,
    );
  }

  prepare(): OrderStatus {
    throw new StatusTransitionException(
      this._value,
      EOrderStatus.InPreparation,
    );
  }

  readyForPickup(): OrderStatus {
    throw new StatusTransitionException(
      this._value,
      EOrderStatus.ReadyForPickup,
    );
  }

  complete(): OrderStatus {
    throw new StatusTransitionException(this._value, EOrderStatus.Completed);
  }

  reject(): OrderStatus {
    throw new StatusTransitionException(
      this._value,
      EOrderStatus.PaymentRejected,
    );
  }
}

class InitiatedOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'Initiated';

  request() {
    return OrderStatus.create('Requested');
  }
}

class RequestedOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'Requested';

  waitPayment() {
    return OrderStatus.create('WaitingPayment');
  }
}

class WaitingPaymentOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'WaitingPayment';

  prepare() {
    return OrderStatus.create('InPreparation');
  }

  reject() {
    return OrderStatus.create('PaymentRejected');
  }
}

class InPreparationOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'InPreparation';

  readyForPickup() {
    return OrderStatus.create('ReadyForPickup');
  }
}

class ReadyForPickupOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'ReadyForPickup';

  complete() {
    return OrderStatus.create('Completed');
  }
}

class CompletedOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'Completed';
}

class PaymentRejectedOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'PaymentRejected';
}
