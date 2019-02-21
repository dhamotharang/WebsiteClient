import { EventTranslation } from './event-translation.model';

export class Event {
    isActive: boolean;
    startDate: string;
    endDate: string;
    concurrencyStamp: string;
    limitedUsers?: number;
    limitedAccompanyPersons: number;
    isAllowRegisterWhenOverload: boolean;
    staffOnly?: boolean;
    isShowPopup?: boolean;
    thumbnail: string;
    isAllowRegister: boolean;
    isAllowAccompanyPerson: boolean;
    tags: any[];
    eventTranslations: EventTranslation[];

    constructor() {
        this.isActive = true;
        this.isAllowRegisterWhenOverload = false;
        this.staffOnly = false;
        this.isAllowAccompanyPerson = true;
        this.isAllowRegister = true;
    }
}
