export abstract class PaymentService {
  abstract createPixPayment(
    amount: number,
  ): Promise<{ conciliationId: string }>;
}