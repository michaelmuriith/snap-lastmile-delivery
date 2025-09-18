export declare class GetNotificationsQuery {
    readonly userId: string;
    readonly page: number;
    readonly limit: number;
    readonly isRead?: boolean | undefined;
    constructor(userId: string, page?: number, limit?: number, isRead?: boolean | undefined);
}
export declare class GetNotificationQuery {
    readonly id: string;
    constructor(id: string);
}
