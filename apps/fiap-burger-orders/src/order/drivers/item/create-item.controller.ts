import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateItemCommand,
  CreateItemResult,
} from '../../application/item/commands/create-item.command';
import { CreateItemInput } from '../../application/item/dtos/create-item.input';

@ApiTags('Items')
@Controller({ version: '1', path: 'items' })
export class CreateItemController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() data: CreateItemInput) {
    const result = await this.commandBus.execute<
      CreateItemCommand,
      CreateItemResult
    >(new CreateItemCommand(data));

    return result;
  }
}
