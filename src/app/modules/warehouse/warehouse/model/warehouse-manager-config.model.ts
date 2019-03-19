import {Permission} from '../../../../shareds/constants/permission.const';

export class WarehouseManagerConfig {
    warehouseId: string;
    userId: string;
    fullName: string;
    avatar: string;
    permissions: number;
    phoneNumber: string;
    email: string;

    constructor(warehouseId?: string,
                userId?: string,
                fullName?: string,
                avatar?: string,
                permissions?: number,
                phoneNumber?: string,
                email?: string) {
        this.warehouseId = warehouseId;
        this.userId = userId;
        this.avatar = avatar;
        this.permissions = permissions ? permissions : Permission.full;
        this.phoneNumber = phoneNumber;
        this.email = email;

    }
}
