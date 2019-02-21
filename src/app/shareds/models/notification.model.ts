export class Notification {
    id: string;
    title: string;
    content: string;
    senderId: string;
    senderFullName: string;
    senderAvatar: string;
    receiverId: string;
    type: number;
    isRead: boolean;
    url: string;
    isSystem: boolean;
    image: string;
    createTime: string;
    createTimeText: string;
}

export const NotificationType = {
    warning: 0,
    info: 1,
    danger: 2,
    user: 3
};

