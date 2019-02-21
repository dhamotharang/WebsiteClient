export class LaborContract {
    id: number;
    userId: string;
    fullName: string;
    no: string;
    type: number;
    typeName: string;
    fromDate: string;
    toDate: string;
    attachments: string;
    note: string;
    isUse: boolean;

    constructor(id?: number, userId?: string, fullName?: string, no?: string, type?: number, typeName?: string, fromDate?: string, toDate?: string, attachments?: string, note?: string, isUse?: boolean) {
        this.id = id ? id : -1;
        this.userId = userId;
        this.fullName = fullName;
        this.no = no;
        this.type = type;
        this.typeName = typeName;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.attachments = attachments;
        this.note = note;
        this.isUse = isUse ? isUse : false;
    }
}
