import {MenuItemTranslation} from './menu-item-translation.model';
import {MenuItemSelectViewModel} from '../viewmodel/menu-item-select.viewmodel';

export const SubjectType = {
    custom: 0,
    news: 1,
    product: 2,
    newsCategory: 3,
    productCategory: 4
};

export class MenuItem {
    subjectId: string;
    subjectType: number;
    icon: string;
    image: string;
    url: string;
    isActive: boolean;
    parentId?: number;
    order: number;
    concurrencyStamp: string;
    modelTranslations: MenuItemTranslation[];
    listMenuItemSelected: MenuItemSelectViewModel[];

    constructor() {
        this.isActive = true;
        this.order = 0;
    }
}
