import { PageTranslation } from './page-translation.model';

export class Page {
    id: number;
    isActive: boolean;
    url: string;
    icon: string;
    bgColor: string;
    order: number;
    parentId?: number;
    pageTranslations: PageTranslation[];

    constructor(id?: number, isActive?: boolean, url?: string, icon?: string, bgColor?: string, order?: number, parentId?: number) {
        this.id = id;
        this.isActive = true;
        this.url = url ? url : '';
        this.icon = icon ? icon : '';
        this.bgColor = bgColor;
        this.order = 0;
        this.parentId = parentId;
    }
}
