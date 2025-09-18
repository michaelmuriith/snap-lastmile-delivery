export class GetDeliveryQuery {
  constructor(public readonly id: string) {}
}

export class GetDeliveriesQuery {
  constructor(
    public readonly customerId?: string,
    public readonly driverId?: string,
    public readonly status?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}