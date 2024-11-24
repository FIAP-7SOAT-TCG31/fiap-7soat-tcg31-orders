import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { GetOrderByIdQuery } from '../../application/order/queries/get-order-by-id.query';
import { GetOrderByIdController } from './get-order-by-id.controller';

describe('GetOrderByIdController', () => {
  let target: GetOrderByIdController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [GetOrderByIdController],
    }).compile();

    target = app.get(GetOrderByIdController);
    queryBus = app.get(QueryBus);
  });

  it('should return existing item', async () => {
    jest.spyOn(queryBus, 'execute').mockResolvedValue({ data: { id: '123' } });
    const id = randomUUID();
    const result = await target.execute(id);
    expect(result.id).toBe('123');
    expect(queryBus.execute).toHaveBeenCalledWith(new GetOrderByIdQuery(id));
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(queryBus, 'execute').mockRejectedValue(err);

    await expect(() => target.execute('123')).rejects.toThrow(err);
    expect(queryBus.execute).toHaveBeenCalledWith(new GetOrderByIdQuery('123'));
  });
});
