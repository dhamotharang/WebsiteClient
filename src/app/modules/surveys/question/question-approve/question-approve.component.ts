import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { QuestionApproveService } from '../service/question-approve.service';
import { QuestionSearchViewModel } from '../viewmodels/question-search.viewmodel';
import { BaseListComponent } from '../../../../base-list.component';
import { TreeData } from '../../../../view-model/tree-data';
import { QuestionStatus, QuestionType } from '../models/question.model';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../../../shareds/services/helper.service';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UtilService } from '../../../../shareds/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { QuestionGroupService } from '../../question-group/service/question-group.service';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { FilterLink } from '../../../../shareds/models/filter-link.model';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { QuestionDetailComponent } from '../question-detail/question-detail.component';
import { QuestionExplainDeclineReasonComponent } from './question-explain-decline-reason.component';
import { ChangeListQuestionStatusModel } from '../models/change-list-question-status.model';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';

@Component({
    selector: 'app-survey-question-approve',
    templateUrl: './question-approve.component.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        QuestionApproveService, HelperService, QuestionGroupService]
})

export class QuestionApproveComponent extends BaseListComponent<QuestionSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(QuestionDetailComponent) questionDetailComponent: QuestionDetailComponent;
    @ViewChild(QuestionExplainDeclineReasonComponent) questionExplainDeclineReasonComponent: QuestionExplainDeclineReasonComponent;
    userIdSearch; // Id người tạo
    status; // Trạng thái phê duyệt
    type; // Loại đáp án
    questionGroupId; // Mã nhóm câu hỏi
    questionType = QuestionType; // Loại câu hỏi
    questionStatus = QuestionStatus; // Trạng thái phê duyệt
    questionGroupTree: TreeData[];
    isGettingTree;
    listQuestionVersionIdSelect;
    listQuestionVersionIdDecline;
    isSelectAll = false;
    isSelectQuestion = false;
    questionGroupName;
    listQuestion: QuestionSearchViewModel[];
    height;
    isShowApprove;
    isShowDecline;
    questionVersionId;
    listQuestionType = [
        {id: QuestionType.singleChoice, name: 'SingleChoice'},
        {id: QuestionType.multiChoice, name: 'MultiChoice'},
        {id: QuestionType.essay, name: 'Essay'},
        {id: QuestionType.vote, name: 'Vote'},
        {
            id: QuestionType.selfResponded, name: 'Self Responded'
        }];
    listQuestionStatus = [
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
                private questionApproveService: QuestionApproveService,
                private helperService: HelperService,
                private questionGroupService: QuestionGroupService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.SURVEY, this.pageId.SURVEY_QUESTION_APPROVE, 'Quản lý câu hỏi', 'Duyệt câu hỏi');
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.type = params.questionType !== undefined && params.questionType !== '' && params.questionType !== null ?
                parseInt(params.questionType) : '';
            this.questionGroupId = params.questionGroupId !== undefined && params.questionGroupId !== ''
            && params.questionGroupId !== null ? parseInt(params.questionGroupId) : '';
            this.userIdSearch = params.creatorId ? params.creatorId : '';
            this.status = params.questionStatus !== undefined && params.questionStatus !== '' && params.questionStatus !== null ?
                parseInt(params.questionStatus) : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });

        this.subscribers.searchResult = this.route.data.subscribe((data: { searchResult: ISearchResult<QuestionSearchViewModel> }) => {
            this.isSearching = false;
            this.listQuestion = data.searchResult.items;
            this.totalRows = data.searchResult.totalRows;
        });
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
        this.questionApproveService.search(this.keyword, this.type, this.questionGroupId, this.userIdSearch, this.status
            , this.currentPage, this.pageSize)
            .pipe(finalize(() => {
                this.isSearching = false;
            }))
            .subscribe((data: ISearchResult<QuestionSearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listQuestion = data.items;
            });
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

    resetFormSearch() {
        this.keyword = '';
        this.userIdSearch = '';
        this.type = null;
        this.status = null;
        this.questionGroupId = null;
        this.questionGroupName = '-- Select question group --';
        this.search(1);
    }

    onSelectUser(value) {
        if (value) {
            this.userIdSearch = value.id;
            this.search(1);
        }
    }

    checkQuestion(question: QuestionSearchViewModel) {
        this.getQuestionVersionIdSelect();
        if (this.listQuestionVersionIdSelect && this.listQuestion && this.listQuestion.length === this.getQuestionVersionIdSelect.length) {
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

    updateMultiStatus(status: number) {
        if (!this.listQuestionVersionIdSelect || this.listQuestionVersionIdSelect.length === 0) {
            this.toastr.error('Please select question');
            return;
        }

        const listQuestionVersionIdDraftSelect = _.map(_.filter(this.listQuestion, (item: QuestionSearchViewModel) => {
            return item.isCheck && item.questionStatus === QuestionStatus.pending;
        }), (questionSelect => {
            return questionSelect.versionId;
        }));

        if (!listQuestionVersionIdDraftSelect || listQuestionVersionIdDraftSelect.length === 0) {
            this.toastr.error('Please select question has status pending');
            return;
        }

        if (status === QuestionStatus.decline) {
            this.listQuestionVersionIdDecline = listQuestionVersionIdDraftSelect;
            this.questionExplainDeclineReasonComponent.isUpdateMultiStatus = true;
            this.questionExplainDeclineReasonComponent.show();
            return;
        }

        const listQuestionUpdateStatus: ChangeListQuestionStatusModel = {
            questionVersionIds: listQuestionVersionIdDraftSelect,
            questionStatus: status,
            reason: '',
        };
        this.questionApproveService.updateMultiStatus(listQuestionUpdateStatus).subscribe((result: any) => {
            const listResult = _.filter(result, (item: IActionResultResponse) => {
                return item.code > 0;
            });
            if (listResult && result && listResult.length === result.length) {
                this.toastr.success('Update success');
            } else {
                this.toastr.error('Have question update error');
            }
            this.search(this.currentPage);
        });
    }

    updateStatus(question: QuestionSearchViewModel, status: number) {
        this.questionVersionId = question.versionId;
        if (status === QuestionStatus.decline) {
            this.questionExplainDeclineReasonComponent.isUpdateMultiStatus = false;
            this.questionExplainDeclineReasonComponent.show();
            return;
        }
        this.questionApproveService.updateStatus(question.versionId, status).subscribe(() => {
            question.questionStatus = status;
            question.statusName = status === QuestionStatus.approved ? 'Approved' : status === QuestionStatus.decline ? 'Decline' : '';
        });
    }

    detail(question: QuestionSearchViewModel) {
        this.questionVersionId = question.versionId;
        this.questionDetailComponent.getDetail(question.versionId);
    }

    private renderFilterLink() {
        const path = 'surveys/question-approve';
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

        this.isShowApprove = this.checkQuestionByStatus(QuestionStatus.approved);
        this.isShowDecline = this.checkQuestionByStatus(QuestionStatus.decline);
        this.isSelectQuestion = this.listQuestionVersionIdSelect && this.listQuestionVersionIdSelect.length > 0;
    }

    private checkQuestionByStatus(status: number): boolean {
        const listQuestionByStatus = _.filter(this.listQuestion, (item: QuestionSearchViewModel) => {
            return item.isCheck &&  item.questionStatus === QuestionStatus.pending;
        });
        return listQuestionByStatus && listQuestionByStatus.length > 0;
    }

    private reloadTree() {
        this.isGettingTree = true;
        this.questionGroupService.getTree().subscribe((result: any) => {
            this.isGettingTree = false;
            this.questionGroupTree = result;
        });
    }
}
