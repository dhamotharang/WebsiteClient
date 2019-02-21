import {BannerItem} from '../models/banner-items.model';

export class BannerResultViewModel {
    bannerId: string;
    bannerName: string;
    type: number;
    isPopUp: boolean;
    position: number;
    bannerItems: BannerItem[];
    isClick?: boolean;

    constructor(bannerId?: string, bannerName?: string, type?: number, isPopUp?: boolean,
                bannerItems?: BannerItem[]) {
        this.bannerId = bannerId;
        this.bannerName = bannerName;
        this.type = type;
        this.isPopUp = isPopUp;
        this.bannerItems = bannerItems;
        this.isClick = true;
    }
}
