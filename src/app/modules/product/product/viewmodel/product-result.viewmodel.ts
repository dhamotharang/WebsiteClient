export class ProductResultViewModel {
    id: string;
    thumbnail: string;
    categoryName: string;
    name: string;
    defaultUnit: string;
    isManagementByLot: boolean;
    isActive: boolean;
    isHot: boolean;
    isHomePage: boolean;

    constructor(id?: string,
                thumbnail?: string,
                categoryName?: string,
                name?: string,
                defaultUnit?: string,
                isManagementByLot?: boolean,
                isActive?: boolean,
                isHot?: boolean,
                isHomePage?: boolean) {
        this.id = id;
        this.thumbnail = thumbnail;
        this.categoryName = categoryName;
        this.name = name;
        this.defaultUnit = defaultUnit;
        this.isManagementByLot = isManagementByLot;
        this.isActive = isActive;
        this.isHot = isHot;
        this.isHomePage = isHomePage;
    }
}
