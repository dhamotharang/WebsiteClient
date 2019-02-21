import {Tag} from '../../../../shareds/components/nh-tags/tag.model';

export class ProductTranslation {
    languageId: string;
    name: string;
    metaTitle: string;
    description: string;
    metaDescription: string;
    metaKeyword: string;
    seoLink: string;
    content: string;
    tags: Tag[];
}
