import {AccompanyPerson} from '../models/event-register.model';

export interface EventRegisterDetailViewModel {
    id: string;
    eventId: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    note: string;
    userId: string;
    registerTime: string;
    isStaff: boolean;
    concurrencyStamp: string;
    role: number;
    avatar: string;
    eventDayRegisters: EventDayRegisterViewModel[];
}

export interface EventDayRegisterViewModel {
    eventDayId: string;
    registerId: string;
    status: number;
    eventDayName: string;
    eventDayDate: string;
    isSelected: boolean;
    accompanyPersons: AccompanyPerson[];
}
