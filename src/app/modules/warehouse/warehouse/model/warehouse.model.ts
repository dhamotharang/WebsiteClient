import { WarehouseManagerConfig } from './warehouse-manager-config.model';

export class Warehouse {
    name: string;
    description: string;
    isActive: boolean;
    address: string;
    concurrencyStamp: string;
    warehouseManagerConfigs: WarehouseManagerConfig[];
    inventoryCalculatorMethod: number;

    constructor(name?: string, description?: string, isActive?: boolean, address?: string) {
        this.name = name;
        this.description = description;
        this.isActive = isActive !== undefined ? isActive : true;
        this.address = address;
    }
}
