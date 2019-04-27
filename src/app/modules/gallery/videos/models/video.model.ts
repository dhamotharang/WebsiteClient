import {VideoTranslation} from './video-translation';
import { Tag } from '../../../../shareds/components/nh-tags/tag.model';

export const VideoType = {
    youtube: 0,
    vimeo: 1,
    pinterest: 2,
    updateServer: 3
}

export class Video {
    id: string;
    albumId: string;
    videoLinkId: string;
    url: string;
    thumbnail: string;
    isActive: boolean;
    order: number;
    type: number;
    isHomePage: boolean;
    concurrencyStamp: string;
    translations: VideoTranslation[];

    constructor(videoLinkId?: string, title?: string, url?: string,
                description?: string, thumbnail?: string, isActive?: boolean, order?: number, type?: number, isHomePage?: boolean) {
        this.videoLinkId = videoLinkId;
        this.url = url;
        this.thumbnail = thumbnail;
        this.isActive = isActive ? isActive : false;
        this.order = order ? order : 1;
        this.type = type ? type : VideoType.youtube;
        this.isHomePage = isHomePage ? isHomePage : false;
        this.concurrencyStamp = '';
        this.translations = [];
    }
}
