import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EOrderStatus,
  OrderStatusValues,
} from '../../../domain/values/order-status.value';
import { OrderRequester } from './requester.dto';

export class OrderItem {
  @ApiProperty()
  public readonly key: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly price: number;
}

export class Order {
  @ApiProperty()
  public readonly id: string;

  @ApiPropertyOptional()
  public readonly requester?: OrderRequester;

  @ApiProperty({ enum: EOrderStatus })
  public readonly status: OrderStatusValues;

  @ApiProperty()
  public readonly total: number;

  @ApiProperty({ type: OrderItem })
  public readonly items: OrderItem[];

  constructor(values: Order) {
    Object.assign(this, values);
  }
}
