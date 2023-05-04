export interface IAssignedBy {
    id: string;
    name: string;
    profilePic: string;
}

export interface IUserNotification {
    id: string;
    isRead: boolean;
}

export interface INotification {
    _id?: string;
    errorType: string;
    client: string;
    clientId?: string;
    environment: string;
    serviceName: string;
    message: string;
    source: string;
    date?: Date;
    user: IUserNotification[];
    assignedBy: IAssignedBy;
    errorId?: string;
}

export interface IGroupedNotification {
    groupName: string;
    notifications: INotification[];
}

export interface IResponseNotification {
    groupNotifications: IGroupedNotification[];
    unreadCount: number;
}


export interface INotificationResponseData {
    count: number;
    result: IResponseNotification;
}

export interface INotificationResponse {
    data: INotificationResponseData;
    message: string;
    statusCode: number;
}

export interface IUpdateStatusParams {
    notificationSource: string,
    name: string,
    profilePic: string,
}