import { VideoTranslation } from '../models/video-translation';
import { Tag } from '../../../../shareds/components/nh-tags/tag.model';

export class VideoDetailViewModel {
    id: string;
    videoLinkId: string;
    thumbnail: string;
    url: string;
    isActive: boolean;
    order: number;
    isHomePage: boolean;
    type: number;
    concurrencyStamp: string;
    tags: Tag[];
    videoTranslations: VideoTranslation[];
}
