export abstract class PreparationService {
  abstract requestPreparation(
    orderId: string,
    items: string[],
  ): Promise<{ conciliationId: string }>;
}
