import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { FindItemsInput } from '../../application/item/dtos/find-items.input';
import {
  FindItemsQuery,
  FindItemsResult,
} from '../../application/item/queries/find-items.query';

@ApiTags('Items')
@Controller({ version: '1', path: 'items' })
export class FindItemsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async execute(@Query() query: FindItemsInput) {
    const result = await this.queryBus.execute<FindItemsQuery, FindItemsResult>(
      new FindItemsQuery(query),
    );

    return result;
  }
}
