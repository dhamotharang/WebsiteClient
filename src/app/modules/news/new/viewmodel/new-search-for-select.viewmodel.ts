export class NewSearchForSelectViewModel {
    id: string;
    featureImage: string;
    languageId: string;
    title: string;
    seoLink: string;
    selected: boolean;

    constructor(id?: string, featureImage?: string, languageId?: string, title?: string,
                seoLink?: string, selected?: boolean) {

        this.id = id;
        this.featureImage = featureImage;
        this.languageId = languageId;
        this.title = title;
        this.seoLink = seoLink;
        this.selected = selected;
    }
}
