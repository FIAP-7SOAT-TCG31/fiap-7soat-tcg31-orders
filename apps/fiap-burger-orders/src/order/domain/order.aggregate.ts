import { AggregateRoot } from '@fiap-burger/tactical-design/core';
import { ItemAdded } from './events/item-added.event';
import { ItemRemoved } from './events/item-removed.event';
import { OrderCheckedOut } from './events/order-checked-out.event';
import { OrderRejected } from './events/order-rejected.event';
import { PreparationRequested } from './events/preparation-requested.event';
import { Item } from './item.entity';
import { OrderItem } from './values/order-item.value';
import { OrderRejectionReason } from './values/order-rejection-reason.value';
import { EOrderStatus, OrderStatus } from './values/order-status.value';
import { Requester } from './values/requester.value';

export class Order extends AggregateRoot {
  constructor(
    protected readonly _id: string,
    private readonly _requester: Requester = null,
    private _status: OrderStatus = OrderStatus.initiate(),
    private _total: number = 0,
    private readonly _items: OrderItem[] = [],
    private _paymentId: string = null,
    private _qrCode: string = null,
    private _preparationId: string = null,
    private _rejectionReason: string = null,
  ) {
    super(_id);
  }

  get status() {
    return this._status.value;
  }

  get requester(): Requester {
    return this._requester;
  }

  get total() {
    return this._total;
  }

  get items() {
    return this._items.map((x) => new OrderItem(x.key, x.name, x.price));
  }

  get paymentId() {
    return this._paymentId;
  }

  get qrCode() {
    return this._qrCode;
  }

  get preparationId() {
    return this._preparationId;
  }

  get rejectionReason() {
    return this._rejectionReason;
  }

  requestPreparation(preparationId: string) {
    this.apply(new PreparationRequested(preparationId));
  }

  onPreparationRequested(event: PreparationRequested) {
    this._status = this._status.complete();
    this._preparationId = event.preparationId;
  }

  reject(reason: OrderRejectionReason) {
    this.apply(new OrderRejected(reason));
  }

  onOrderRejected(event: OrderRejected) {
    this._status = this._status.reject();
    this._rejectionReason = event.reason;
  }

  addItem(item: Item) {
    const status = this._status.value;
    if (status !== EOrderStatus.Initiated) {
      throw new Error(`Cannot add item, order is already at status ${status}`);
    }
    this.apply(new ItemAdded(item));
  }

  onItemAdded({ item }: ItemAdded) {
    const orderItem = OrderItem.fromItem(item);
    this._items.push(orderItem);
    this.calculatePrice(orderItem.price);
  }

  removeItem(item: OrderItem) {
    const status = this._status.value;
    if (status !== EOrderStatus.Initiated) {
      throw new Error(
        `Cannot remove item, order is already at status ${status}`,
      );
    }
    this.apply(new ItemRemoved(item));
  }

  onItemRemoved({ item }: ItemRemoved) {
    const foundItem = this._items.findIndex((x) => x.key === item.key);
    if (foundItem < 0) {
      return;
    }
    this._items.splice(foundItem, 1);
    this.calculatePrice(-item.price);
  }

  checkout(paymentId: string, qrCode: string) {
    this.apply(new OrderCheckedOut(paymentId, qrCode));
  }

  onOrderCheckedOut(event: OrderCheckedOut) {
    this._status = this._status.request();
    this._paymentId = event.paymentId;
    this._qrCode = event.qrCode;
  }

  private calculatePrice(itemPrice: number) {
    const ensureFinancialAmount = (value: number) => Number(value.toFixed(2));
    this._total = ensureFinancialAmount(this._total + itemPrice);
  }
}
