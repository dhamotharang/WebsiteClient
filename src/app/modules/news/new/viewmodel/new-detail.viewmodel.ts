import {NewsTranslation} from '../model/news-translations.model';
import {CommentViewModel} from './comment.viewmodel';
import {CategoryNewsViewModel} from './categoryNewsViewModel';

export class NewDetailViewModel {
    id: string;
    likeCount: number;
    commentCount: number;
    viewCount: number;
    createTime: Date;
    status: number;
    approvedTime: Date;
    approverFullName: string;
    approverAvatar: string;
    approverComment: string;
    concurrencyStamp: string;
    featureImage: string;
    bannerImage: string;
    altImage: string;
    source: string;
    isHot: boolean;
    isHomePage: boolean;
    isActive: boolean;
    seoLink: string;
    sentTime: Date;
    creatorId: string;
    creatorFullName: string;
    creatorAvatar: string;
    newsTranslations: NewsTranslation[];
    listComment: CommentViewModel[];
    isApprove: boolean;
    categoriesNews: CategoryNewsViewModel[];
}
