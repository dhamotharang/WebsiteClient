import { WarehouseManagerConfig } from '../model/warehouse-manager-config.model';

export class WarehouseDetailViewModel {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    address: string;
    concurrencyStamp: string;
    inventoryCalculatorMethod: number;
    warehouseManagerConfigs: WarehouseManagerConfig[];
}
