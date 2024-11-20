import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemRepository } from '../application/item/abstractions/item.repository';
import { MongooseItemSchemaFactory } from './persistance/mongoose/item/item-schema.factory';
import { MongooseItemRepository } from './persistance/mongoose/item/item.repository';
import {
  MongooseItemSchema,
  MongooseItemSchemaModel,
} from './persistance/mongoose/item/item.schema';

const MongooseSchemaModule = MongooseModule.forFeature([
  {
    name: MongooseItemSchema.name,
    schema: MongooseItemSchemaModel,
  },
]);

MongooseSchemaModule.global = true;

@Module({
  imports: [MongooseSchemaModule],
  providers: [
    MongooseItemSchemaFactory,
    {
      provide: ItemRepository,
      useClass: MongooseItemRepository,
    },
  ],
  exports: [ItemRepository],
})
export class InfraModule {}
