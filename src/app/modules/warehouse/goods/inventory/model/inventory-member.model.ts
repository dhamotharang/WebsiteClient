export class InventoryMember {
    id: string;
    inventoryId: string;
    userId: string;
    fullName: string;
    avatar: string;
    positionName: string;
    officeName: string;
    description: string;

    constructor(userId?: string,
                fullName?: string,
                position?: string,
                description?: string) {
        this.userId = userId;
        this.fullName = fullName;
        this.positionName = position;
        this.description = description;
    }
}
