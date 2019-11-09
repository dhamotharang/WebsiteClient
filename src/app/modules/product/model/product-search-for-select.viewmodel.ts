export class ProductSearchForSelectViewModel {
    id: string;
    image: string;
    languageId: string;
    name: string;
    seoLink: string;
    selected: boolean;
    description: string;

    constructor(id?: string, image?: string, languageId?: string, name?: string,
                seoLink?: string, selected?: boolean) {

        this.id = id;
        this.image = image;
        this.languageId = languageId;
        this.name = name;
        this.seoLink = seoLink;
        this.selected = selected;
    }
}
