export class PhotoGroup {
    isActive: boolean;
    concurrencyStamp: string;
    imageTranslations: PhotoGroupTranslation[];
}

export class PhotoGroupTranslation {
    languageId: string;
    title: string;
    description: string;
}
