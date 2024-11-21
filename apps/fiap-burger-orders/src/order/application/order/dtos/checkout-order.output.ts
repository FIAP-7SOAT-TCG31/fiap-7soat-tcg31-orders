import { ApiProperty } from '@nestjs/swagger';

export class CheckoutOrderOutput {
  @ApiProperty()
  public readonly qrCode: string;

  constructor(qrCode: string) {
    this.qrCode = qrCode;
  }
}
