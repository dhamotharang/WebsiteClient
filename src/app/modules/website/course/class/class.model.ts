export class Classes {
    id: number;
    courseId: number;
    name: string;
    description: string;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    address: string;
    createTime: string;

    constructor(id?: number, courseId?: number, name?: string, description?: string, startDate?: string, endDate?: string,
        isActive?: boolean, address?: string) {
        this.id = id;
        this.courseId = courseId;
        this.name = name;
        this.description = description ? description : '';
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive ? isActive : false;
        this.address = address ? address : '';
    }
}
