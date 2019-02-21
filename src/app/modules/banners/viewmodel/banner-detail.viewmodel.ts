import {BannerItem} from '../models/banner-items.model';

export class BannerDetailViewModel {
    id: string;
    name: string;
    type: number;
    description: string;
    displayType: number;
    effectType: number;
    isActive: boolean;
    isPopUp: boolean;
    position: number;
    concurrencyStamp: string;
    bannerItems: BannerItem[];
}
