import {BannerItem} from './banner-items.model';
import {Positions} from '../../../shareds/constants/position.const';

export const BannerType = {
    normal: 0,
    advertising: 1
};

export const DisplayType = {
    static: 0,
    slide: 1,
};

export const EffectType = {
    fade: 0,
    slideRight: 1,
    slideLeft: 2,
    slideDown: 3,
    slideUp: 4,
    bounce: 5,
    slip: 6,
    lightSpeed: 7,
    rotate: 8,
    zoom: 9,
    roll: 10
};

export class Banner {
    name: string;
    type: number;
    description: string;
    displayType: number;
    effectType: number;
    isActive: boolean;
    isPopup: boolean;
    position: number;
    concurrencyStamp: string;
    bannerItems: BannerItem[];

    constructor() {
        this.name = '';
        this.description = '';
        this.isActive = true;
        this.isPopup = false;
        this.displayType = DisplayType.slide;
        this.effectType = EffectType.fade;
        this.type = BannerType.normal;
        this.position = Positions.top;
    }
}
