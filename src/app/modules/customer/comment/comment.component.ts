import {Component, Inject, OnInit} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {Comment} from './comment';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {FeedbackService} from '../feedback/feedback.service';
import {finalize} from 'rxjs/internal/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent extends BaseListComponent<Comment> implements OnInit {
    isShow;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private feedbackService: FeedbackService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.PATIENT, this.pageId.COMMENT,
            'Quản lý bình luận', 'Bình luận');
        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.feedbackService.searchComment(this.isShow, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: any) => {
                this.listItems = data.items;
                this.totalRows = data.totalRows;
            });
    }

    updateIsShow(item: Comment) {
        this.feedbackService.updateIsShowComment(item.id, item.isShow).subscribe(() => {
        });
    }

    delete(item) {
        this.feedbackService.deleteComment(item.id).subscribe(() => {
            this.search(1);
        });
    }

}
