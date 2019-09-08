import {CoreValuesTranslation} from './core-values.translation';

export class CoreValue {
    order: number;
    isActive: boolean;
    image: string;
    url: string;
    concurrencyStamp: string;
    translations: CoreValuesTranslation[];

    constructor(order?: number,
                isActive?: boolean,
                concurrencyStamp?: string, image?: string) {
        this.order = order ? order : 0;
        this.isActive = isActive;
        this.concurrencyStamp = concurrencyStamp ? concurrencyStamp : '';
        this.translations = [];
        this.image = image ? image : '';
    }
}
