import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { QuestionService } from './service/question.service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UtilService } from '../../../shareds/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { HelperService } from '../../../shareds/services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from 'rxjs/operators';
import { BaseListComponent } from '../../../base-list.component';
import { QuestionSearchViewModel } from './viewmodels/question-search.viewmodel';
import { QuestionStatus, QuestionType } from './models/question.model';
import { TreeData } from '../../../view-model/tree-data';
import { QuestionGroupService } from '../question-group/service/question-group.service';
import * as _ from 'lodash';
import { QuestionFormComponent } from './question-form/question-form.component';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { ChangeListQuestionStatusModel } from './models/change-list-question-status.model';

@Component({
    selector: 'app-survey-question',
    templateUrl: './question.component.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        QuestionService, HelperService, QuestionGroupService]
})

export class QuestionComponent extends BaseListComponent<QuestionSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(QuestionFormComponent) questionFormComponent: QuestionFormComponent;
    @ViewChild(QuestionDetailComponent) questionDetailComponent: QuestionDetailComponent;
    userIdSearch; // Id người tạo
    status; // Trạng thái phê duyệt
    type; // Loại đáp án
    questionGroupId; // Mã nhóm câu hỏi
    questionType = QuestionType; // Loại câu hỏi
    questionStatus = QuestionStatus; // Trạng thái phê duyệt
    questionGroupTree: TreeData[];
    isGettingTree;
    listQuestionVersionIdSelect;
    isSelectAll = false;
    isSelectQuestion = false;
    questionGroupName;
    listQuestion: QuestionSearchViewModel[];
    height;
    currentUser;
    listQuestionType = [
        {id: QuestionType.singleChoice, name: 'SingleChoice'},
        {id: QuestionType.multiChoice, name: 'MultiChoice'},
        {id: QuestionType.essay, name: 'Essay'},
        {id: QuestionType.vote, name: 'Vote'},
        {
            id: QuestionType.selfResponded, name: 'Self Responded'
        }];
    listQuestionStatus = [
        {id: QuestionStatus.draft, name: 'Draft'},
        {id: QuestionStatus.pending, name: 'Pending'},
        {id: QuestionStatus.approved, name: 'Approved'},
        {id: QuestionStatus.decline, name: 'Decline'}];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private cdr: ChangeDetectorRef,
                private questionService: QuestionService,
                private helperService: HelperService,
                private questionGroupService: QuestionGroupService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.SURVEY, this.pageId.SURVEY_QUESTION, 'Quản lý câu hỏi', 'Ngân hàng câu hỏi');
        this.subscribers.searchResult = this.route.data.subscribe((data: { searchResult: ISearchResult<QuestionSearchViewModel> }) => {
            this.isSearching = false;
            this.listQuestion = data.searchResult.items;
            this.totalRows = data.searchResult.totalRows;
        });
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.type = params.questionType !== undefined && params.questionType !== '' && params.questionType !== null ?
                parseInt(params.questionType) : '';
            this.questionGroupId = params.questionGroupId !== undefined && params.questionGroupId !== ''
            && params.questionGroupId !== null ? parseInt(params.questionGroupId) : '';
            this.userIdSearch = params.creatorId ? params.creatorId : '';
            this.status = params.questionStatus !== undefined && params.questionStatus !== '' && params.questionStatus !== null
                ? parseInt(params.questionStatus) : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
        this.currentUser = this.appService.currentUser;
    }

    ngAfterViewInit() {
        this.reloadTree();
        this.height = window.innerHeight - 270;
        this.cdr.detectChanges();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 270;
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.questionService.search(this.keyword, this.type, this.questionGroupId, this.userIdSearch, this.status
            , this.currentPage, this.pageSize)
            .pipe(finalize(() => {
                this.isSearching = false;
                this.getQuestionVersionIdSelect();
            }))
            .subscribe((data: ISearchResult<QuestionSearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listQuestion = data.items;
            });
    }

    resetFormSearch() {
        this.keyword = '';
        this.userIdSearch = '';
        this.type = null;
        this.status = null;
        this.questionGroupId = null;
        this.questionGroupName = '-- Select question group --';
        this.search(1);
    }

    add() {
        this.questionFormComponent.add();
    }

    edit(question: QuestionSearchViewModel) {
        this.questionFormComponent.edit(question);
    }

    delete(versionId: string) {
        this.questionService.delete(versionId).subscribe(() => {
            _.remove(this.listQuestion, (item: QuestionSearchViewModel) => {
                return item.versionId === versionId;
            });
        });
    }

    deleteMultiQuestion() {
        if (!this.listQuestionVersionIdSelect || this.listQuestionVersionIdSelect.length === 0) {
            this.toastr.error('Please select question');
        }

        const listQuestionVersionIdDraftSelect = _.map(_.filter(this.listQuestion, (item: QuestionSearchViewModel) => {
            return item.isCheck && (item.questionStatus === QuestionStatus.draft || item.questionStatus === QuestionStatus.decline);
        }), (questionSelect => {
            return questionSelect.versionId;
        }));

        if (!listQuestionVersionIdDraftSelect || listQuestionVersionIdDraftSelect.length === 0) {
            this.toastr.error('Please select question has status draft or decline');
            return;
        }

        this.questionService.deleteMultiQuestion(listQuestionVersionIdDraftSelect).subscribe(() => {
            this.search(1);
        });
    }

    sendMultiQuestion() {
        if (!this.listQuestionVersionIdSelect || this.listQuestionVersionIdSelect.length === 0) {
            this.toastr.error('Please select question');
            return;
        }

        const listQuestionVersionIdDraftSelect = _.map(_.filter(this.listQuestion, (item: QuestionSearchViewModel) => {
            return item.isCheck && (item.questionStatus === QuestionStatus.draft || item.questionStatus === QuestionStatus.decline);
        }), (questionSelect => {
            return questionSelect.versionId;
        }));

        if (!listQuestionVersionIdDraftSelect || listQuestionVersionIdDraftSelect.length === 0) {
            this.toastr.error('Please select question has status draft or decline');
            return;
        }

        const listQuestionUpdateStatus: ChangeListQuestionStatusModel = {
            questionVersionIds: listQuestionVersionIdDraftSelect,
            questionStatus: QuestionStatus.pending,
            reason: '',
        };
        this.questionService.updateMultiStatus(listQuestionUpdateStatus).subscribe(() => {
            this.search(this.currentPage);
        });
    }

    send(question: QuestionSearchViewModel) {
        this.questionService.updateStatus(question.versionId, QuestionStatus.pending, '').subscribe(() => {
            question.questionStatus = QuestionStatus.pending;
            question.statusName = 'Pending';
        });
    }

    detail(question: QuestionSearchViewModel) {
        this.questionDetailComponent.getDetail(question.versionId);
    }

    onSelectQuestionGroup(value) {
        if (value) {
            this.questionGroupId = value.id;
            this.questionGroupName = value.name;
            this.search(1);
        } else {
            this.questionGroupId = null;
            this.questionGroupName = '';
            this.search(1);
        }
    }

    onSelectUser(value) {
        if (value) {
            this.userIdSearch = value.id;
            this.search(1);
        }
    }

    checkQuestion(question: QuestionSearchViewModel) {
        this.getQuestionVersionIdSelect();
        if (this.listQuestionVersionIdSelect && this.listQuestion && this.listQuestion.length === this.listQuestionVersionIdSelect.length) {
            this.isSelectAll = true;
        } else {
            this.isSelectAll = false;
        }
    }

    checkAll() {
        if (this.listQuestion) {
            _.each(this.listQuestion, (item: QuestionSearchViewModel) => {
                item.isCheck = this.isSelectAll;
            });
            this.getQuestionVersionIdSelect();
        }
    }

    private renderFilterLink() {
        const path = 'surveys/question';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('questionType', this.type),
            new FilterLink('questionGroupId', this.questionGroupId),
            new FilterLink('creatorId', this.userIdSearch),
            new FilterLink('questionStatus', this.status),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }

    private getQuestionVersionIdSelect() {
        this.listQuestionVersionIdSelect = _.map(_.filter(this.listQuestion, (item: QuestionSearchViewModel) => {
            return item.isCheck;
        }), (questionSelect => {
            return questionSelect.versionId;
        }));
        this.isSelectQuestion = this.listQuestionVersionIdSelect && this.listQuestionVersionIdSelect.length > 0;
    }

    private reloadTree() {
        this.isGettingTree = true;
        this.questionGroupService.getTree().subscribe((result: any) => {
            this.isGettingTree = false;
            this.questionGroupTree = result;
        });
    }
}
