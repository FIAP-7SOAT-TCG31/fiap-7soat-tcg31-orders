import { Injectable } from '@nestjs/common';
import { PreparationService } from '../../application/order/abstractions/preparation.service';

@Injectable()
export class FiapBurgerPreparationService implements PreparationService {
  async requestPreparation(
    orderId: string,
    items: string[],
  ): Promise<{ conciliationId: string }> {
    throw new Error('Method not implemented.');
  }
}
