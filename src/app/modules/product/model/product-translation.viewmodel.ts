import {Tag} from '../../news/new/model/news.model';

export class ProductTranslationViewModel {
    languageId: string;
    name: string;
    description: string;
    unsignName: string;
    metaDescription: string;
    metaKeyword: string;
    seoLink: string;
    content: string;
    alt: string;
    tags: Tag[];
}
