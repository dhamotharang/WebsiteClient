import {Tag} from './news.model';

export class NewsTranslation {
    languageId: string;
    title: string;
    metaTitle: string;
    description: string;
    metaDescription: string;
    metaKeyword: string;
    seoLink: string;
    content: string;
    tags: Tag[];
}
