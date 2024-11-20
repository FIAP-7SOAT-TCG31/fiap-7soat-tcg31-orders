import { StatusTransitionException } from '../errors/status-transition.exception';
import {
  EOrderStatus,
  OrderStatus,
  OrderStatusValues,
} from './order-status.value';

const AllStatuses: OrderStatusValues[] = [
  'Initiated',
  'Requested',
  'WaitingPayment',
  'InPreparation',
  'ReadyForPickup',
  'Completed',
  'PaymentRejected',
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
    [EOrderStatus.Initiated, EOrderStatus.InPreparation, false],
    [EOrderStatus.Initiated, EOrderStatus.PaymentRejected, false],
    [EOrderStatus.Initiated, EOrderStatus.ReadyForPickup, false],
    [EOrderStatus.Initiated, EOrderStatus.Requested, true],
    [EOrderStatus.Initiated, EOrderStatus.WaitingPayment, false],

    [EOrderStatus.Requested, EOrderStatus.Initiated, false],
    [EOrderStatus.Requested, EOrderStatus.Completed, false],
    [EOrderStatus.Requested, EOrderStatus.InPreparation, false],
    [EOrderStatus.Requested, EOrderStatus.PaymentRejected, false],
    [EOrderStatus.Requested, EOrderStatus.ReadyForPickup, false],
    [EOrderStatus.Requested, EOrderStatus.Requested, false],
    [EOrderStatus.Requested, EOrderStatus.WaitingPayment, true],

    [EOrderStatus.WaitingPayment, EOrderStatus.Initiated, false],
    [EOrderStatus.WaitingPayment, EOrderStatus.Completed, false],
    [EOrderStatus.WaitingPayment, EOrderStatus.InPreparation, true],
    [EOrderStatus.WaitingPayment, EOrderStatus.PaymentRejected, true],
    [EOrderStatus.WaitingPayment, EOrderStatus.ReadyForPickup, false],
    [EOrderStatus.WaitingPayment, EOrderStatus.Requested, false],
    [EOrderStatus.WaitingPayment, EOrderStatus.WaitingPayment, false],

    [EOrderStatus.InPreparation, EOrderStatus.Initiated, false],
    [EOrderStatus.InPreparation, EOrderStatus.Completed, false],
    [EOrderStatus.InPreparation, EOrderStatus.InPreparation, false],
    [EOrderStatus.InPreparation, EOrderStatus.PaymentRejected, false],
    [EOrderStatus.InPreparation, EOrderStatus.ReadyForPickup, true],
    [EOrderStatus.InPreparation, EOrderStatus.Requested, false],
    [EOrderStatus.InPreparation, EOrderStatus.WaitingPayment, false],

    [EOrderStatus.ReadyForPickup, EOrderStatus.Initiated, false],
    [EOrderStatus.ReadyForPickup, EOrderStatus.Completed, true],
    [EOrderStatus.ReadyForPickup, EOrderStatus.InPreparation, false],
    [EOrderStatus.ReadyForPickup, EOrderStatus.PaymentRejected, false],
    [EOrderStatus.ReadyForPickup, EOrderStatus.ReadyForPickup, false],
    [EOrderStatus.ReadyForPickup, EOrderStatus.Requested, false],
    [EOrderStatus.ReadyForPickup, EOrderStatus.WaitingPayment, false],

    [EOrderStatus.Completed, EOrderStatus.Initiated, false],
    [EOrderStatus.Completed, EOrderStatus.Completed, false],
    [EOrderStatus.Completed, EOrderStatus.InPreparation, false],
    [EOrderStatus.Completed, EOrderStatus.PaymentRejected, false],
    [EOrderStatus.Completed, EOrderStatus.ReadyForPickup, false],
    [EOrderStatus.Completed, EOrderStatus.Requested, false],
    [EOrderStatus.Completed, EOrderStatus.WaitingPayment, false],

    [EOrderStatus.PaymentRejected, EOrderStatus.Initiated, false],
    [EOrderStatus.PaymentRejected, EOrderStatus.Completed, false],
    [EOrderStatus.PaymentRejected, EOrderStatus.InPreparation, false],
    [EOrderStatus.PaymentRejected, EOrderStatus.PaymentRejected, false],
    [EOrderStatus.PaymentRejected, EOrderStatus.ReadyForPickup, false],
    [EOrderStatus.PaymentRejected, EOrderStatus.Requested, false],
    [EOrderStatus.PaymentRejected, EOrderStatus.WaitingPayment, false],
  ])('Order Status Transitions', (from, to, success) => {
    it(`should${success ? ' ' : ' not '}allow transition from ${from} to ${to}`, () => {
      const target = OrderStatus.create(from as OrderStatusValues);
      const methods: Record<OrderStatusValues, string> = {
        Completed: 'complete',
        Initiated: 'initiate',
        InPreparation: 'prepare',
        PaymentRejected: 'reject',
        ReadyForPickup: 'readyForPickup',
        Requested: 'request',
        WaitingPayment: 'waitPayment',
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
