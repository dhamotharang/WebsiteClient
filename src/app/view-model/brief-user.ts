export interface UserPermission {
    pageId: number;
    permissions: number;
}

export interface BriefUser {
    id?: string;
    userName?: string;
    fullName?: string;
    image?: string;
    email?: string;
    phoneNumber?: string;
    gender?: number;
    permissions: UserPermission[];
}
