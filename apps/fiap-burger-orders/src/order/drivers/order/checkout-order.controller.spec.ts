import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutOrderCommand } from '../../application/order/commands/checkout-order.command';
import { CheckoutOrderOutput } from '../../application/order/dtos/checkout-order.output';
import { CheckoutOrderController } from './checkout-order.controller';

describe('CheckoutOrderController', () => {
  let target: CheckoutOrderController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CheckoutOrderController],
    }).compile();

    target = app.get(CheckoutOrderController);
    commandBus = app.get(CommandBus);
  });

  it('should execute CheckoutOrder command', async () => {
    jest.spyOn(commandBus, 'execute').mockResolvedValue(null);
    const id = '123';
    const result = await target.execute(id);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new CheckoutOrderCommand(id),
    );
    expect(result).toBeInstanceOf(CheckoutOrderOutput);
    expect(result.qrCode).toBeInstanceOf(CheckoutOrderOutput);
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    const id = '123';
    await expect(() => target.execute(id)).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new CheckoutOrderCommand(id),
    );
  });
});
