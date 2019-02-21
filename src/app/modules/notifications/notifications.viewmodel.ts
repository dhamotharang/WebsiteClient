export interface Notifications {
    id: number;
    title: string;
    content: string;
    fromUserId: string;
    toUserId: string;
    fromUserImage: string;
    type: number;
    idRead: boolean;
    url: string;
    time: string;
}
