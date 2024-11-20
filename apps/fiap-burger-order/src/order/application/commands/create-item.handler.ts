import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Item } from '../../domain/item.entity';
import { ItemRepository } from '../abstractions/item.repository';
import { CreateItemCommand, CreateItemResult } from './create-item.command';

@CommandHandler(CreateItemCommand)
export class CreateItemHandler
  implements ICommandHandler<CreateItemCommand, CreateItemResult>
{
  constructor(private readonly repository: ItemRepository) {}

  async execute({ data }: CreateItemCommand): Promise<CreateItemResult> {
    const { name, price, description, type, images } = data;
    const id = this.repository.generateId();
    const item = new Item(id, name, price, type, description, images);
    await this.repository.create(item);

    return new CreateItemResult(id);
  }
}
