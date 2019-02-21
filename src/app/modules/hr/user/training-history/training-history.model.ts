export class TrainingHistory {
    id: number;
    type: boolean;
    userId: string;
    fullName: string;
    courseId: number;
    courseName: string;
    fromDate: string;
    toDate: string;
    result: string;
    coursePlaceId: number;
    coursePlaceName: string;
    isHasCertificate: boolean;

    constructor(id?: number, type?: boolean, userId?: string, fullName?: string, courseId?: number, courseName?: string, fromDate?: string, toDate?: string, result?: string, coursePlaceId?: number,
        coursePlaceName?: string, isHasCertificate?: boolean) {
        this.id = id ? id : -1;
        this.type = type ? type : false;
        this.userId = userId;
        this.fullName = fullName;
        this.courseId = courseId;
        this.courseName = courseName;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.result = result;
        this.coursePlaceId = coursePlaceId;
        this.coursePlaceName = coursePlaceName;
        this.isHasCertificate = isHasCertificate ? isHasCertificate : false;
    }
}
