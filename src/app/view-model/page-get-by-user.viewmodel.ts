export interface PageGetByUserViewModel {
    id: number;
    name: string;
    url: string;
    icon: string;
    parentId?: number;
    idPath: string;
    bgColor: string;
    order: number;
    orderPath: string;
    childCount: number;
    permissions: number;
}
