import { randomUUID } from 'crypto';
import { ItemAdded } from './events/item-added.event';
import { OrderCheckedOut } from './events/order-checked-out.event';
import { Item } from './item.entity';
import { Order } from './order.aggregate';
import { OrderItem } from './values/order-item.value';
import { Requester } from './values/requester.value';

const createSpiedTarget = () => {
  const requester = new Requester(
    randomUUID(),
    'John Doe',
    '01234567890',
    'john@doe.com',
  );
  const target = new Order(randomUUID(), requester);

  jest.spyOn(target as any, 'applyEvent');
  return target;
};

describe('Order', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should add item to order', () => {
    const target = createSpiedTarget();
    const item = new Item('1', 'XBurger', 12.99, 'Dessert', 'desc');
    target.addItem(item);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, ...rest } = OrderItem.fromItem(item);
    expect(target.total).toBe(12.99);
    expect(target.items).toEqual(
      expect.arrayContaining([expect.objectContaining(rest)]),
    );
    expect((target as any).applyEvent).toHaveBeenCalledWith(
      new ItemAdded(item),
    );
  });

  it('should remove item from order', () => {
    const target = createSpiedTarget();
    const anItem = new Item('1', 'XBurger', 12.99, 'Dessert', 'desc');
    const anotherItem = new Item('2', 'XEgg', 14.99, 'Dessert', 'desc');
    target.addItem(anItem);
    target.addItem(anotherItem);
    const [first, second] = target.items;
    target.removeItem(first);
    expect(target.total).toBe(14.99);
    expect(target.items).toEqual(expect.arrayContaining([second]));
  });

  it('should checkout order ', () => {
    const target = createSpiedTarget();
    const anItem = new Item('1', 'XBurger', 12.99, 'Dessert', 'desc');
    const anotherItem = new Item('2', 'XEgg', 14.99, 'Dessert', 'desc');
    target.addItem(anItem);
    target.addItem(anotherItem);
    target.checkout();
    expect(target.total).toBe(anItem.price + anotherItem.price);
    expect((target as any).applyEvent).toHaveBeenCalledWith(
      new OrderCheckedOut(),
    );
  });

  it('should not allow adding or removig items from checked out order ', () => {
    const target = createSpiedTarget();
    const anItem = new Item('1', 'XBurger', 12.99, 'Dessert', 'desc');
    const anotherItem = new Item('2', 'XEgg', 14.99, 'Dessert', 'desc');
    target.addItem(anItem);
    target.checkout();

    const [item] = target.items;

    expect(() => target.addItem(anotherItem)).toThrow();
    expect(() => target.removeItem(item)).toThrow();
  });
});