export interface PageSearchViewModel {
    id: number;
    name: string;
    namePrefix: string;
    description: string;
    isActive: boolean;
    url: string;
    icon: string;
    bgColor: string;
    order: number;
    parentId?: number;
    idPath?: string;
}
