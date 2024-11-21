import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { OrderRequester } from './requester.dto';

class OrderItemInput {
  @IsString()
  id: string;
}

export class CreateOrderInput {
  @IsArray()
  @IsOptional()
  items?: OrderItemInput[];

  // This comes from the authentication token
  requester?: OrderRequester;
}

export class CreateOrderOutput {
  @ApiProperty()
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
