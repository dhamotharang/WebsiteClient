export interface EventRegisterViewModel {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    note: string;
    userId: string;
    registerTime: string;
    creatorId: string;
    creatorFullName: string;
    creatorAvatar: string;
    accompanyPersons: EventAccompanyPerson[];
}

export interface EventAccompanyPerson {
    id: string;
    eventDayId: string;
    registerId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
}
