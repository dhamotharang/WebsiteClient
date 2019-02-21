export class Course {
    id: number;
    name: string;
    description: string;
    content: string;
    isActive: boolean;
    seoLink: string;
    isActiveText: string;

    constructor(id?: number, name?: string, description?: string, content?: string, isActive?: boolean, seoLink?: string) {
        this.id = id;
        this.name = name;
        this.description = description ? description : '';
        this.content = content ? content : '';
        this.isActive = isActive ? isActive : false;
        this.seoLink = seoLink;
        this.isActiveText = isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt';
    }
}
