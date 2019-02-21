import {RegisterRole} from '../../../shareds/constants/register-role.conts';

export class EventRegister {
    id: string;
    userId: string;
    phoneNumber: string;
    fullName: string;
    email: string;
    address: string;
    note: string;
    avatar: string;
    role: number;
    concurrencyStamp: string;
    eventDayRegisters: EventDayRegister[];

    constructor() {
        this.role = RegisterRole.walkInGuest;
    }
}

export class EventDayRegister {
    eventDayId: string;
    eventDayName: string;
    eventDayDate: string;
    isSelected: boolean;
    accompanyPersons: AccompanyPerson[];

    constructor() {
        this.isSelected = false;
    }
}

export class AccompanyPerson {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;

    constructor() {
        this.id = '';
        this.fullName = '';
        this.phoneNumber = '';
        this.email = '';
    }
}
