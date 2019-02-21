export class EventDay {
    id: string;
    isActive: boolean;
    concurrencyStamp: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    limitedUsers?: number;
    limitedAccompanyPersons: number;
    staffOnly: boolean;
    eventDate: string;
    isAllowAccompanyPerson: boolean;
    eventDayTranslations: EventDayTranslation[];

    constructor() {
        this.isActive = true;
        this.isAllowAccompanyPerson = true;
        this.staffOnly = false;
        this.startHour = 0;
        this.startMinute = 0;
        this.endHour = 0;
        this.endMinute = 0;
    }
}

export class EventDayTranslation {
    languageId: string;
    name: string;
    description: string;
    address: string;
    seoLink: string;
    metaDescription: string;
}
