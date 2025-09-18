export class GetPaymentQuery {
  constructor(public readonly id: string) {}
}

export class GetPaymentsQuery {
  constructor(
    public readonly customerId?: string,
    public readonly deliveryId?: string,
    public readonly status?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}