import { InventoryDetail } from './inventory-detail.model';
import { InventoryMember } from './inventory-member.model';
import * as moment from 'moment';

export enum InventoryStatus {
    temporary,
    balanced
}

export class Inventory {
    id: string;
    warehouseId: string;
    warehouseName: string;
    inventoryDate: string;
    note: string;
    status: number;
    details: InventoryDetail[];
    members: InventoryMember[];
    concurrencyStamp: string;

    constructor(warehouseId?: string, inventoryDate?: Date, note?: string, status?: number) {
        this.warehouseId = warehouseId;
        this.warehouseName = '';
        // this.inventoryDate = inventoryDate ? inventoryDate : new Date();
        this.note = note;
        this.status = InventoryStatus.temporary;
        this.details = [];
        this.members = [];
        this.concurrencyStamp = '';
        this.inventoryDate = moment().format('YYYY/MM/DD HH:mm:ss');
    }
}
