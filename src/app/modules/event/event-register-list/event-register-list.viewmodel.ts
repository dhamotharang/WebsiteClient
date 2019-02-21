import { AccompanyPerson } from '../models/event-register.model';

export interface EventRegisterListViewModel {
    id: string;
    eventId: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    eventDays: EventRegisterDayViewModel[];
}

export interface EventRegisterDayViewModel {
    id: string;
    registerId: string;
    name: string;
    status: number;
    accompanyPersons: AccompanyPerson[];
}
