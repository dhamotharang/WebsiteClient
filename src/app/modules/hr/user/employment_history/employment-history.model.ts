export class EmploymentHistory {
    id: number;
    userId: string;
    fullName: string;
    type: boolean;
    fromDate: string;
    toDate: string;
    officeId: number;
    officeName: string;
    titleId: number;
    titleName: string;
    companyId: number;
    companyName: string;
    note: string;
    isCurrent: boolean;
    createTime: string;

    constructor(id?: number, userId?: string, fullName?: string, type?: boolean, fromDate?: string, toDate?: string,
        officeId?: number, officeName?: string, titleId?: number, titleName?: string, companyId?: number, companyName?: string,
        note?: string, isCurrent?: boolean, createTime?: string) {
        this.id = id ? id : -1;
        this.userId = userId;
        this.fullName = fullName;
        this.type = type;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.officeId = officeId;
        this.officeName = officeName;
        this.titleId = titleId;
        this.titleName = titleName;
        this.companyId = companyId;
        this.companyName = companyName;
        this.note = note;
        this.isCurrent = isCurrent ? isCurrent : true;
        this.createTime = createTime;
    }
}
