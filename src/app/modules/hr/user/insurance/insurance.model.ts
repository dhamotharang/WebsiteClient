export class Insurance {
    id: number;
    userId: string;
    type: boolean;
    companyId: number;
    companyName: string;
    fromDate: string;
    toDate: string;
    premium: number;
    note: string;

    constructor(id?: number, userId?: string, type?: boolean, companyId?: number, companyName?: string, fromDate?: string, toDate?: string, premium?: number, note?: string) {
        this.id = id ? id : -1;
        this.userId = userId;
        this.type = type;
        this.companyId = companyId;
        this.companyName = companyName;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.premium = premium;
        this.note = note;
    }
}
