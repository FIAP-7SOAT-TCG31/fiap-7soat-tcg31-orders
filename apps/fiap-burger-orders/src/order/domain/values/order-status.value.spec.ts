import { StatusTransitionException } from '../errors/status-transition.exception';
import {
  EOrderStatus,
  OrderStatus,
  OrderStatusValues,
} from './order-status.value';

const AllStatuses: OrderStatusValues[] = [
  'Initiated',
  'Requested',
  'Rejected',
  'Completed',
];

describe('OrderStatus', () => {
  describe.each(AllStatuses)('Static create', (value) => {
    it(`should create an instance of ${value}`, () => {
      const actual = OrderStatus.create(value);
      expect(actual.value).toBe(value);
      expect(actual.constructor.name).toBe(`${value}OrderStatus`);
    });
  });

  describe('Static request', () => {
    it('should create a new requested status', () => {
      const actual = OrderStatus.initiate();
      expect(actual.value).toBe(EOrderStatus.Initiated);
      expect(actual.constructor.name).toBe('InitiatedOrderStatus');
    });
  });

  describe.each([
    [EOrderStatus.Initiated, EOrderStatus.Initiated, false],
    [EOrderStatus.Initiated, EOrderStatus.Completed, false],
    [EOrderStatus.Initiated, EOrderStatus.Rejected, false],
    [EOrderStatus.Initiated, EOrderStatus.Requested, true],

    [EOrderStatus.Requested, EOrderStatus.Initiated, false],
    [EOrderStatus.Requested, EOrderStatus.Completed, true],
    [EOrderStatus.Requested, EOrderStatus.Rejected, true],
    [EOrderStatus.Requested, EOrderStatus.Requested, false],

    [EOrderStatus.Completed, EOrderStatus.Initiated, false],
    [EOrderStatus.Completed, EOrderStatus.Completed, false],
    [EOrderStatus.Completed, EOrderStatus.Rejected, false],
    [EOrderStatus.Completed, EOrderStatus.Requested, false],

    [EOrderStatus.Rejected, EOrderStatus.Initiated, false],
    [EOrderStatus.Rejected, EOrderStatus.Completed, false],
    [EOrderStatus.Rejected, EOrderStatus.Rejected, false],
    [EOrderStatus.Rejected, EOrderStatus.Requested, false],
  ])('Order Status Transitions', (from, to, success) => {
    it(`should${success ? ' ' : ' not '}allow transition from ${from} to ${to}`, () => {
      const target = OrderStatus.create(from as OrderStatusValues);
      const methods: Record<OrderStatusValues, string> = {
        Completed: 'complete',
        Initiated: 'initiate',
        Requested: 'request',
        Rejected: 'reject',
      };
      const method = methods[to];
      if (success) {
        const actual = target[method]();
        expect(actual.value).toBe(to);
      } else {
        expect(() => target[method]()).toThrow(
          new StatusTransitionException(from, to),
        );
      }
    });
  });
});
