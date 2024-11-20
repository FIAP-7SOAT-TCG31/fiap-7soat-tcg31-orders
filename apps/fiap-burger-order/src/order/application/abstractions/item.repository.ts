import { Repository } from '@fiap-burger/tactical-design/core';
import { Item } from '../../domain/item.entity';

export abstract class ItemRepository implements Repository<Item> {
  abstract findById(id: string): Promise<Item>;
  abstract findAll(): Promise<Item[]>;
  abstract create(entity: Item): Promise<void>;
  abstract update(entity: Item): Promise<void>;
  abstract generateId(): string;
}