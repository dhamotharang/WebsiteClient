export class CommendationDiscipline {
    id: number;
    userId: string;
    fullName: string;
    type: boolean;
    time: string;
    decisionNo: string;
    reason: string;
    money: number;
    categoryId: number;
    categoryName: string;
    attachmentUrl: string;
    officeId: number;
    officeName: string;
    titleId: number;
    titleName: string;
    month: number;
    quarter: number;
    year: number;
    creatorId: string;
    creatorFullName: string;

    constructor(id?: number, userId?: string, fullName?: string, type?: boolean, time?: string, decisionNo?: string, reason?: string, money?: number,
        categoryId?: number, categoryName?: string, attachmentUrl?: string, officeId?: number, officeName?: string, titleId?: number,
        titleName?: string, month?: number, quarter?: number, year?: number, isDelete?: boolean, creatorId?: string, creatorFullName?: string) {
        this.id = id ? id : -1;
        this.userId = userId;
        this.fullName = fullName;
        this.type = type;
        this.time = time;
        this.decisionNo = decisionNo;
        this.reason = reason;
        this.money = money;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.attachmentUrl = attachmentUrl;
        this.officeId = officeId;
        this.officeName = officeName;
        this.titleId = titleId;
        this.titleName = titleName;
        this.month = month;
        this.quarter = quarter;
        this.year = year;
        this.creatorId = creatorId;
        this.creatorFullName = creatorFullName;
    }
}
