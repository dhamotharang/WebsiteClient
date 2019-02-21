import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseListComponent} from '../../../../base-list.component';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {finalize} from 'rxjs/operators';
import {NewsService} from '../service/news.service';
import {NewsSearchViewModel} from '../viewmodel/news-search.viewmodel';
import {NewsStatus} from '../model/news.model';
import {FilterLink} from '../../../../shareds/models/filter-link.model';
import {UtilService} from '../../../../shareds/services/util.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {HelperService} from '../../../../shareds/services/helper.service';
import {QuestionGroupService} from '../../../surveys/question-group/service/question-group.service';
import * as _ from 'lodash';
import {ChangeListNewsStatus} from '../model/changeListNewsStatus.model';
import {ToastrService} from 'ngx-toastr';
import {SearchNewViewModel} from '../viewmodel/searchNewViewModel';
import {TreeData} from '../../../../view-model/tree-data';
import {CategoryService} from '../../category/category.service';
import {ChangeNewsStatus} from '../model/newStatus.model';
import {SwalComponent} from '@toverux/ngx-sweetalert2';

@Component({
    selector: 'app-news',
    templateUrl: './news-list.component.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        NewsService, HelperService, QuestionGroupService]
})

export class NewsComponent extends BaseListComponent<NewsSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDeleteNews') swalConfirmDelete: SwalComponent;
    creatorId; // Id người tạo
    status; // Trạng thái phê duyệt
    height;
    listNewStatus = [
        {id: NewsStatus.draft, name: 'Draft'},
        {id: NewsStatus.pending, name: 'Pending'},
        {id: NewsStatus.approved, name: 'Approved'},
        {id: NewsStatus.decline, name: 'Decline'}];
    newStatus = NewsStatus;
    isCheckAll;
    listNews: NewsSearchViewModel[];
    listNewsSelect: string [];
    newsStatus = NewsStatus;
    isApprove = true;
    categoryId: number;
    listNewsIdForApprove;
    listNewsIdForSend;
    categoryTree: TreeData[];
    newsId;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private router: Router,
                private location: Location,
                private cdr: ChangeDetectorRef,
                private toastr: ToastrService,
                private utilService: UtilService,
                private route: ActivatedRoute,
                private categoryService: CategoryService,
                private newsService: NewsService) {
        super();

        this.categoryService.getTree().subscribe((result: TreeData[]) => this.categoryTree = result);
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.NEWS, this.pageId.NEWS_LIST, 'Quản lý tin tức', 'Danh sách tin tức');
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchNewViewModel }) => {
            const data = result.data.searchResult;
            this.totalRows = data.totalRows;
            this.listNews = data.items;
            this.rendResult();
            this.isApprove = result.data.isApprove;
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.creatorId = params.creatorId ? params.creatorId : '';
            this.categoryId = params.categoryId ? parseInt(params.categoryId) : -1;
            this.status = params.questionStatus !== undefined && params.questionStatus !== '' && params.questionStatus !== null
                ? parseInt(params.questionStatus) : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
        this.currentUser = this.appService.currentUser;
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 270;
        this.cdr.detectChanges();

        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.newsId);
        });
    }

    onSelectUser(value) {
        if (value) {
            this.creatorId = value.id;
            this.search(1);
        }
    }

    onRemoveUser() {
        this.creatorId = '';
        this.search(1);
    }

    selectCategory(value: TreeData) {
        if (value) {
            this.categoryId = value.id;
        } else {
            this.categoryId = -1;
        }
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.newsService.search(this.keyword, this.categoryId, this.creatorId, this.status,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false)).subscribe((result: SearchNewViewModel) => {
            this.totalRows = result.searchResult.totalRows;
            this.listNews = result.searchResult.items;
            this.rendResult();
            this.isApprove = result.isApprove;
            this.getListNewSelect();
        });
    }

    delete(id: string) {
        this.newsService.delete(id)
            .subscribe(() => {
                _.remove(this.listNews, (item: NewsSearchViewModel) => {
                    return item.id === id;
                });
            });
    }

    edit(item: NewsSearchViewModel) {
        this.router.navigate([`/news/edit/${item.id}`]);
    }

    detail(item: NewsSearchViewModel) {
        this.router.navigate([`/news/detail/${item.id}`]);
    }

    viewHistory(id) {
        this.router.navigate([`/news/view-history/${id}`]);
    }

    resetFormSearch() {
        this.keyword = '';
        this.creatorId = '';
        this.status = '';
        this.search(1);
    }

    selectAll() {
        const listSelect = _.filter(this.listNews, (item: NewsSearchViewModel) => {
            return ((item.status === NewsStatus.decline || item.status === NewsStatus.draft) && item.creatorId === this.currentUser.id)
                || (item.status === NewsStatus.pending && this.isApprove);
        });

        _.each(listSelect, (item: NewsSearchViewModel) => {
            item.isCheck = this.isCheckAll;
        });

        this.getListNewSelect();
    }

    selectNew(value: NewsSearchViewModel) {
        this.getListNewSelect();
        this.isCheckAll = this.listNewsSelect && this.listNews && this.listNews.length === this.listNewsSelect.length;
    }

    getListNewSelect() {
        this.listNewsSelect = _.map(_.filter(this.listNews, (item: NewsSearchViewModel) => {
            return item.isCheck;
        }), (newsSelect => {
            return newsSelect.id;
        }));

        this.listNewsIdForApprove = _.map(_.filter(this.listNews, (item: NewsSearchViewModel) => {
            return item.isCheck && item.status === NewsStatus.pending && this.isApprove;
        }), (newsSelect => {
            return newsSelect.id;
        }));

        this.listNewsIdForSend = _.map(_.filter(this.listNews, (item: NewsSearchViewModel) => {
            return item.isCheck && (item.status === NewsStatus.decline || item.status === NewsStatus.draft)
                && item.creatorId === this.currentUser.id;
        }), (newsSelect => {
            return newsSelect.id;
        }));
    }

    approveNews() {
        const changeListNewsStatus = new ChangeListNewsStatus(this.listNewsIdForApprove, NewsStatus.approved, '');
        this.newsService.updateListNewsStatus(changeListNewsStatus).subscribe(() => {
            // this.search(1);
            this.updateNewsStatusByListNewsSelect(this.listNewsIdForApprove, NewsStatus.approved);
        });
    }

    updateNewsStatusByListNewsSelect(listNewsIdSelect: string, status: number) {
        const listNewsById = _.filter(this.listNews, (news: NewsSearchViewModel) => {
            return listNewsIdSelect.indexOf(news.id) > -1;
        });

        if (listNewsById && listNewsById.length > 0) {
            _.each(listNewsById, (item: NewsSearchViewModel) => {
                this.updateStatusName(item, status);
                item.isCheck = false;
            });

            this.getListNewSelect();
        }
    }

    updateStatusName(news: NewsSearchViewModel, status: number) {
        news.status = status;
        news.statusName = status === NewsStatus.draft ? 'Draft' :
            status === NewsStatus.pending ? 'Pending' :
                status === NewsStatus.approved ? 'Approved' :
                    status === NewsStatus.decline ? 'Decline' : '';
    }

    declineNew(value) {
        if (value) {
            const changeListNewsStatus = new ChangeListNewsStatus(this.listNewsIdForApprove, NewsStatus.decline, value);
            this.newsService.updateListNewsStatus(changeListNewsStatus).subscribe(() => {
                this.updateNewsStatusByListNewsSelect(this.listNewsIdForApprove, NewsStatus.decline);
            });
        } else {
            this.toastr.error('Please enter decline reason');
        }
    }

    updateStatus(news: NewsSearchViewModel, status: number, declineReason) {
        const changeNewsStatus = new ChangeNewsStatus(status, declineReason);
        if ((declineReason && status === NewsStatus.decline) || status !== NewsStatus.decline) {
            this.newsService.updateStatus(news.id, changeNewsStatus).subscribe(() => {
                this.updateStatusName(news, status);
            });
        } else {
            this.toastr.error('Please enter decline reason');
        }
    }

    sendNews() {
        const changeListNewsStatus = new ChangeListNewsStatus(this.listNewsIdForSend, NewsStatus.pending, '');
        this.newsService.updateListNewsStatus(changeListNewsStatus).subscribe(() => {
            this.updateNewsStatusByListNewsSelect(this.listNewsIdForSend, NewsStatus.pending);
        });
    }

    deleteNews() {
        this.newsService.deleteMultiNews(this.listNewsIdForSend).subscribe(() => {
            _.remove(this.listNews, (item: NewsSearchViewModel) => {
                return this.listNewsIdForSend.indexOf(item.id) > -1;
            });
        });
    }

    confirm(value: NewsSearchViewModel) {
        this.newsId = value.id;
        this.swalConfirmDelete.show();
    }

    updateIsHot(news: NewsSearchViewModel) {
        this.newsService.updateIsHot(news.id, !news.isHot).subscribe(() => {
            news.isHot = !news.isHot;
        });
    }

    updateIsHomePage(news: NewsSearchViewModel) {
        this.newsService.updateIsHomePage(news.id, !news.isHomePage).subscribe(() => {
            news.isHomePage = !news.isHomePage;
        });
    }

    private rendResult() {
        _.each(this.listNews, (item: NewsSearchViewModel) => {
            item.categoryNews = _.join(item.categoriesNames, ', ');
        });
    }

    renderFilterLink() {
        const path = 'news';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('categoryId', this.categoryId),
            new FilterLink('creatorId', this.creatorId),
            new FilterLink('status', this.status),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
