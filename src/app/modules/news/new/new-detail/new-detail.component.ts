import {Component, Inject, OnInit} from '@angular/core';
import {NewDetailViewModel} from '../viewmodel/new-detail.viewmodel';
import {NewsService} from '../service/news.service';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {NewsTranslation} from '../model/news-translations.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NewsStatus} from '../model/news.model';
import {BaseFormComponent} from '../../../../base-form.component';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {CommentViewModel} from '../viewmodel/comment.viewmodel';
import * as _ from 'lodash';
import {TreeComment} from '../model/tree-comment.model';
import {ToastrService} from 'ngx-toastr';
import {ChangeNewsStatus} from '../model/newStatus.model';
import {CategoryNewsViewModel} from '../viewmodel/categoryNewsViewModel';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-new-detail',
    templateUrl: './new-detail.component.html',
    styleUrls: ['../news.scss']
})

export class NewDetailComponent extends BaseFormComponent implements OnInit {
    newDetail: NewDetailViewModel;
    newsTranslation: NewsTranslation[];
    comments = [];
    listCategory;
    isApprove;
    newsStatus = NewsStatus;
    declineReason;
    listComment = [];
    listCategoryNews: CategoryNewsViewModel[];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private newsService: NewsService) {
        super();
        //this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.NEWS, this.pageId.NEWS_LIST, 'Quản lý tin tức', 'Chi tiết tin tức');
        this.route.params.subscribe((params: any) => {
            const id = params['id'];
            if (id) {
                this.getDetail(id);
            }
        });


        this.comments = this.renderCommentTree(this.listComment, null);
    }

    closeForm() {
        this.router.navigate(['/news']);
    }

    delete() {
        this.newsService.delete(this.newDetail.id)
            .subscribe(() => {
                this.router.navigate(['/news']);
            });
    }

    edit() {
        this.router.navigate([`/news/edit/${this.newDetail.id}`]);
    }

    send(status: number) {
        const newsStatus = new ChangeNewsStatus(status, '');
        this.newsService.updateStatus(this.newDetail.id, newsStatus).subscribe(() => {
            this.newDetail.status = status;
            this.getDetail(this.newDetail.id);
        });
    }

    declineNew(value) {
        if (value) {
            const newsStatus = new ChangeNewsStatus(NewsStatus.decline, value);
            this.newsService.updateStatus(this.newDetail.id, newsStatus).subscribe(() => {
                this.newDetail.status = NewsStatus.decline;
                this.getDetail(this.newDetail.id);
            });
        } else {
            this.toastr.error('Please enter decline reason');
        }
    }

    getDetail(id: string) {
        this.newsService.getDetail(id).subscribe((result: ActionResultViewModel<NewDetailViewModel>) => {
            this.newDetail = result.data;
            const listNewsTranslationDetail = _.each(this.newDetail.newsTranslations, (item: any) => {
                item.content = item.content.replace(new RegExp('"uploads/', 'g'), '"' + environment.fileUrl + 'uploads/');
            });
            this.newsTranslation = this.newDetail.newsTranslations;
            this.listComment = this.newDetail.listComment;
            this.listCategoryNews = _.filter(this.newDetail.categoriesNews, (item: CategoryNewsViewModel) => {
                return item.languageId === this.currentLanguage;
            });
        });
    }

    selectLanguage(value) {
        console.log(value);
        this.currentLanguage = value.id;
        this.listCategoryNews = _.filter(this.newDetail.categoriesNews, (item: CategoryNewsViewModel) => {
            return item.languageId === this.currentLanguage;
        });
    }

    private renderCommentTree(listComment: CommentViewModel[], parentId?: number) {
        const comments = _.filter(listComment, (comment: CommentViewModel) => {
            return comment.parentId === parentId;
        });
        const treeComment = [];
        if (comments && comments.length > 0) {
            _.each(comments, (commentChildren: CommentViewModel) => {
                const childCount = _.countBy(listComment, (item: CommentViewModel) => {
                    return item.parentId === commentChildren.id;
                }).true;

                const children = this.renderCommentTree(listComment, commentChildren.id);
                treeComment.push(new TreeComment(commentChildren.id, commentChildren.parentId, commentChildren.idPath,
                    commentChildren.fullName,
                    commentChildren.email, commentChildren.avatar, commentChildren.sendTime, commentChildren.content,
                    childCount, children));
            });
        }
        return treeComment;
    }
}
