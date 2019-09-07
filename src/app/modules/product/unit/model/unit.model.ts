import {UnitTranslations} from './unit-translations.model';

export class Unit {
    id: string;
    isActive: boolean;
    concurrencyStamp: string;
    translations: UnitTranslations[];

    constructor() {
        this.isActive = true;
    }
}
