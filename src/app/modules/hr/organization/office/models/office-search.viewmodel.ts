export interface OfficeSearchViewModel {
    id: number;
    name: string;
    nameLevel: string;
    shortName: string;
    code: string;
    idPath: string;
    isActive: string;
    activeStatus: string;
    parentId?: number;
    parentName: string;
    childCount: number;
    officeType: number;
}
