export interface TitleDetailViewModel {
    id: string;
    isActive: string;
    concurrencyStamp: string;
    order: number;
    titleTranslations: TitleTranslationViewModel[];
}

export interface TitleTranslationViewModel {
    languageId: string;
    name: string;
    shortName: string;
    description: string;
}
