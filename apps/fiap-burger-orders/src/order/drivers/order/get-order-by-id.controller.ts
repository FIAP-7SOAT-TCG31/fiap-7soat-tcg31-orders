import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from '../../application/order/dtos/order.dto';
import {
  GetOrderByIdQuery,
  GetOrderByIdResult,
} from '../../application/order/queries/get-order-by-id.query';
import { ObjectIdValidationPipe } from '../../infra/pipes/object-id-validation.pipe';

@ApiTags('Orders')
@Controller({ version: '1', path: 'orders' })
export class GetOrderByIdController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Find an item with its id',
    description: 'Returns an existing item by querying it with its id',
  })
  @ApiOkResponse({ type: Order })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async execute(@Param('id', new ObjectIdValidationPipe()) id: string) {
    const result = await this.queryBus.execute<
      GetOrderByIdQuery,
      GetOrderByIdResult
    >(new GetOrderByIdQuery(id));

    return result.data;
  }
}
