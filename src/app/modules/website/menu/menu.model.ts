export class Menu {
    id: number;
    name: string;
    idPath: string;
    isActive: boolean;
    url: string;
    icon: string;
    order: number;
    parentId: number;
    childCount: number;
    namePrefix: string;
    referenceType: number;
    listReference: number[];

    constructor() {
        this.isActive = true;
        this.referenceType = 0;
        this.listReference = [];
        this.namePrefix = '';
    }
}
