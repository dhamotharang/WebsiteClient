export class MenuItemSelectViewModel {
    id: any;
    name: string;
    order: number;
    icon: string;
    image: string;

    constructor(id?: any, name?: string, order?: number, icon?: string, image?: string) {
        this.id = id;
        this.name = name;
        this.order = order;
        this.icon = icon;
        this.image = image;
    }
}
