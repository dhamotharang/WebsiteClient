import {InventoryMember} from '../model/inventory-member.model';
import {InventoryDetail} from '../model/inventory-detail.model';

export class InventoryDetailViewModel {
    id: string;
    warehouseId: string;
    warehouseName: string;
    note: string;
    inventoryDate: Date;
    members: InventoryMember[];
    details: InventoryDetail[];
    concurrencyStamp: string;
    totalProduct: number;
    status: number;
    TotalItems: number;
}
