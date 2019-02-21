export class JobSearchViewModel {
    id: number;
    name: string;
    idPath: string;
    isActive: boolean;
    parentId?: number;
    description: string;
    childCount: number;
    activeStatus: string;
    nameLevel: string;
}
