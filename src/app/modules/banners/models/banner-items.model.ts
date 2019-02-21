export class BannerItem {
    id: string;
    name: string;
    url: string;
    image: string;
    order: number;
    alt: string;
    description: string;
    totalClick: number;

    constructor(id?: string, name?: string, url?: string, image?: string, order?: number, alt?: string,
                isNew?: boolean, isEdit?: boolean, description?: string,
                totalClick?: number) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.image = image;
        this.order = order;
        this.alt = alt;
        this.description = this.description;
        this.totalClick = totalClick;
    }
}
