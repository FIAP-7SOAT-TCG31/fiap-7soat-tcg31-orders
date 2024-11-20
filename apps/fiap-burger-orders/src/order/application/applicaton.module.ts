import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfraModule } from '../infra/infra.module';
import { CreateItemHandler } from './item/commands/create-item.handler';
import { UpdateItemHandler } from './item/commands/update-item.handler';
import { GetItemByIdHandler } from './item/queries/get-item-by-id.handler';

const QueryHandlers = [GetItemByIdHandler];
const CommandHandlers = [CreateItemHandler, UpdateItemHandler];

@Module({
  imports: [CqrsModule, InfraModule],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class ApplicationModule {}
