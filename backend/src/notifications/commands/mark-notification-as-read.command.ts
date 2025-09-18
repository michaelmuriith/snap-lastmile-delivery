export class MarkNotificationAsReadCommand {
  constructor(public readonly id: string) {}
}

export class MarkAllNotificationsAsReadCommand {
  constructor(public readonly userId: string) {}
}