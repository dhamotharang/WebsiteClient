export class CourseRegister {
    id: number;
    courseId: number;
    classId: number;
    userId: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    note: string;
    status: number;

    constructor() {
        this.status = 0;
    }
}
