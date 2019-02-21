export class NhUserPicker {
    id: string | number;
    fullName: string;
    avatar: string;
    description: string;
    isSelected: boolean;

    constructor(id: any, fullName: string, avatar?: string, description?: string) {
        this.id = id;
        this.fullName = fullName;
        this.avatar = avatar;
        this.description = description;
        this.isSelected = false;
    }
}
