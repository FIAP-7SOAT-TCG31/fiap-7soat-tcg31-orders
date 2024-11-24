import { ApiProperty } from '@nestjs/swagger';

export class OrderFollowUp {
  @ApiProperty()
  public readonly orderId: string;

  @ApiProperty()
  public readonly customer: string;

  @ApiProperty()
  public readonly waitingTime: string;

  constructor(values: OrderFollowUp) {
    Object.assign(this, values);
  }
}

export class FollowUpOutput {
  @ApiProperty({ type: [OrderFollowUp] })
  public readonly ready?: OrderFollowUp[];

  @ApiProperty({ type: [OrderFollowUp] })
  public readonly started?: OrderFollowUp[];

  @ApiProperty({ type: [OrderFollowUp] })
  public readonly received?: OrderFollowUp[];

  constructor(values: FollowUpOutput) {
    Object.assign(this, values);
  }
}