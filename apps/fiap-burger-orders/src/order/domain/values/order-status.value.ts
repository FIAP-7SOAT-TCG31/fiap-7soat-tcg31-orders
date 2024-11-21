import { StatusTransitionException } from '../errors/status-transition.exception';

export enum EOrderStatus {
  Initiated = 'Initiated',
  Requested = 'Requested',
  Completed = 'Completed',
  Rejected = 'Rejected',
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
      Completed: CompletedOrderStatus,
      Rejected: RejectedOrderStatus,
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

  complete(): OrderStatus {
    throw new StatusTransitionException(this._value, EOrderStatus.Completed);
  }

  reject(): OrderStatus {
    throw new StatusTransitionException(this._value, EOrderStatus.Rejected);
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

  complete() {
    return OrderStatus.create('Completed');
  }

  reject() {
    return OrderStatus.create('Rejected');
  }
}

class CompletedOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'Completed';
}

class RejectedOrderStatus extends OrderStatus {
  protected _value: OrderStatusValues = 'Rejected';
}
