
export class Relationship {
    userId: string;
    relationalUserId: string;
    relationshipTypeId: string;
    description: string;
    isActive: boolean;
    concurrencyStamp: string;

    constructor() {
        this.isActive = true;
    }
}
