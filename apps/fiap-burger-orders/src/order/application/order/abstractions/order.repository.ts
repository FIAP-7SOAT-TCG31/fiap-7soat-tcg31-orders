import { Repository } from '@fiap-burger/tactical-design/core';
import { Order } from '../../../domain/order.aggregate';

export abstract class OrderRepository implements Repository<Order> {
  abstract create(entity: Order): Promise<void>;
  abstract update(entity: Order): Promise<void>;
  abstract findById(id: string): Promise<Order>;
  abstract findAll(): Promise<Order[]>;
  abstract generateId(): string;
}
