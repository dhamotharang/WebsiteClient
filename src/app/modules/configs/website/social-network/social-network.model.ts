export class SocialNetwork {
    id: string;
    name: string;
    image: string;
    url: string;
    icon: string;
    order: number;
    isEdit: boolean;
    isNew: boolean;
    concurrencyStamp: string;

    constructor(id?: string, name?: string, image?: string, utl?: string, icon?: string, order?: number, isEdit?: boolean, isNew?: boolean, concurrencyStamp?: string) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.url = utl;
        this.icon = icon;
        this.order = order;
        this.isEdit = isEdit;
        this.isNew = isNew;
        this.concurrencyStamp = concurrencyStamp;
    }
}
