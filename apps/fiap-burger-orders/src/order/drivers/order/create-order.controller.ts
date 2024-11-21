import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  CreateOrderCommand,
  CreateOrderResult,
} from '../../application/order/commands/create-order.command';
import { CreateOrderInput } from '../../application/order/dtos/create-order.input';
import { CreateOrderOutput } from '../../application/order/dtos/create-order.output';

@ApiTags('Orders')
@Controller({ version: '1', path: 'orders' })
export class CreateOrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new order',
    description: 'Creates a new order',
  })
  @ApiCreatedResponse({ type: CreateOrderOutput })
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  @ApiInternalServerErrorResponse()
  async execute(@Body() data: CreateOrderInput) {
    /**
     * TODO: Add authentication user as requester
     * Add an @Roles auth guard too taking form token
     * @AuthUser() user: { email?, cpf?, name}
     * data.requester = user;
     */
    const result = await this.commandBus.execute<
      CreateOrderCommand,
      CreateOrderResult
    >(new CreateOrderCommand(data));

    return result.data;
  }
}
