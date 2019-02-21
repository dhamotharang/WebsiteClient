import {CoreValuesTranslation} from './core-values.translation';

export class CoreValue {
    order: number;
    isActive: boolean;
    concurrencyStamp: string;
    translations: CoreValuesTranslation[];

    constructor(order?: number,
                isActive?: boolean,
                concurrencyStamp?: string) {
        this.order = order ? order : 0;
        this.isActive = isActive;
        this.concurrencyStamp = concurrencyStamp ? concurrencyStamp : '';
        this.translations = [];
    }
}
