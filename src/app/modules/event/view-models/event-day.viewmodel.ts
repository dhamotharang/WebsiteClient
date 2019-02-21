export interface EventDayViewModel {
    id: string;
    name: string;
    isActive: boolean;
    isAllowAccompanyPerson: boolean;
    eventDate: string;
    staffOnly: boolean;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    limitedUsers: number;
    totalRegisters: number;
    totalAccompanyPersons: number;
    status: number;
}
