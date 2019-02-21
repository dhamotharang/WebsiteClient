import { PageTranslation } from './page-translation.model';

export interface PageDetailViewModel {
    id: number;
    bgColor: string;
    icon: string;
    isActive: boolean;
    order: number;
    url: string;
    parentId?: number;
    pageTranslation: PageTranslation[];
}
