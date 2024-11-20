import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import {
  GetItemByIdQuery,
  GetItemByIdResult,
} from '../../application/item/queries/get-item-by-id.query';
import { ObjectIdValidationPipe } from '../../infra/pipes/object-id-validation.pipe';

@ApiTags('Items')
@Controller({ version: '1', path: 'items' })
export class GetItemByIdController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async execute(@Param('id', new ObjectIdValidationPipe()) id: string) {
    const result = await this.queryBus.execute<
      GetItemByIdQuery,
      GetItemByIdResult
    >(new GetItemByIdQuery(id));

    return result.data;
  }
}
