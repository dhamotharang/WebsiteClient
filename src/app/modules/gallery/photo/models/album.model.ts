import {Photo} from './photo.model';
import {Video} from '../../videos/models/video.model';

export class Album {
    isActive: boolean;
    isPublic: boolean;
    concurrencyStamp: string;
    thumbnail: string;
    type: number;
    translations: AlbumTranslation[];
    photos: Photo[];
    videos: Video[];

    constructor() {
        this.isActive = true;
        this.type = 1;
        this.isPublic = true;
    }
}

export class AlbumTranslation {
    languageId: string;
    title: string;
    description: string;
    seoLink: string;
    metaTitle: string;
    metaDescription: string;
}
