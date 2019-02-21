export interface CategoryViewModel {
    id: string;
    name: string;
    isActive: boolean;
    parentId?: number;
    idPath: string;
}
