export class GetNotificationsQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly isRead?: boolean,
  ) {}
}

export class GetNotificationQuery {
  constructor(public readonly id: string) {}
}