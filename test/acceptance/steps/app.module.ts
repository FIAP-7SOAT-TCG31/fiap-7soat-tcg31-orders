import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ItemSuite } from './step-definitions/item.suite';
@Module({
  imports: [HttpModule],
  providers: [ItemSuite],
})
export class AppModule {}
