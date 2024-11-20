import { AggregateRoot } from '@fiap-burger/tactical-design/core';
import { ItemAdded } from './events/item-added.event';
import { ItemRemoved } from './events/item-removed.event';
import { OrderCheckedOut } from './events/order-checked-out.event';
import { Item } from './item.entity';
import { OrderItem } from './values/order-item.value';
import { EOrderStatus, OrderStatus } from './values/order-status.value';
import { Requester } from './values/requester.value';

export class Order extends AggregateRoot {
  constructor(
    protected readonly _id: string,
    private readonly _requester: Requester,
    private _status: OrderStatus = OrderStatus.initiate(),
    private _total: number = 0,
    private readonly _items: OrderItem[] = [],
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
    return this._items.map((x) =>
      Object.assign(Object.create(Item.prototype), x),
    );
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

  checkout() {
    this.apply(new OrderCheckedOut());
  }

  onOrderCheckedOut() {
    this._status = this._status.request();
  }

  private calculatePrice(itemPrice: number) {
    this._total = this._total + itemPrice;
  }
}
