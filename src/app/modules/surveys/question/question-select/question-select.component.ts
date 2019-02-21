import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { QuestionService } from '../service/question.service';
import { QuestionGroupService } from '../../question-group/service/question-group.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { SuggestionViewModel } from '../../../../shareds/view-models/SuggestionViewModel';

@Component({
    selector: 'app-question-select',
    templateUrl: './question-select.component.html',
    styleUrls: ['./question-select.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class QuestionSelectComponent implements OnInit {
    @ViewChild('questionSelectModal') questionSelectModal: NhModalComponent;
    @Output() accepted = new EventEmitter();
    questionKeyword: string;
    questionGroupId: number;
    questionGroupKeyword: string;
    isSearching = false;
    listQuestions = [];
    listQuestionGroups = [];

    totalSelectedQuestion: number;
    totalQuestionRows = 0;
    totalQuestionGroupRows = 0;

    currentQuestionPage = 0;
    currentQuestionGroupPage = 0;

    questionGroupTree = [];

    pageSize = 10;
    viewType = 0;
    differ: any;
    private _listSelectedQuestions = [];
    private _listSelectedQuestionGroups = [];

    @Input()
    set listSelectedQuestions(value: any) {
        this._listSelectedQuestions = _.cloneDeep(value);
    }

    get listSelectedQuestions() {
        return this._listSelectedQuestions;
    }

    @Input()
    set listSelectedQuestionGroups(value: any) {
        this._listSelectedQuestionGroups = _.cloneDeep(value);
    }

    get listSelectedQuestionGroups() {
        return this._listSelectedQuestionGroups;
    }

    constructor(private toastr: ToastrService,
                private questionService: QuestionService,
                private questionGroupService: QuestionGroupService) {
    }

    ngOnInit() {
    }

    show() {
        this.questionSelectModal.open();
        this.viewType = 0;
        this.calculateTotalSelectedQuestion();
        this.searchQuestion(1);
    }

    changeViewType(viewType: number) {
        if (this.viewType === viewType) {
            return;
        }
        this.viewType = viewType;
        if (this.viewType === 0) {
            this.searchQuestion(1);
        } else {
            this.searchQuestionGroup(1);
        }
    }

    questionGroupChangeTotalQuestion(questionGroup: any, value: number) {
        questionGroup.totalQuestion = +value;
        this.calculateTotalSelectedQuestion();
    }

    selectQuestion(question: any) {
        const selectedQuestion = _.find(this.listSelectedQuestions, (item: SuggestionViewModel<string>) => {
            return item.id === question.id;
        });

        if (selectedQuestion) {
            return;
        }

        question.isSelected = true;
        this.listSelectedQuestions.push(question);
        this.calculateTotalSelectedQuestion();
    }

    selectQuestionGroup(questionGroup: any) {
        const selectedQuestionGroup = _.find(this.listSelectedQuestionGroups, (item) => {
            return item.id === questionGroup.id;
        });
        if (selectedQuestionGroup) {
            return;
        }
        questionGroup.isSelected = true;
        this.listSelectedQuestionGroups.push(questionGroup);
        this.calculateTotalSelectedQuestion();
    }

    refreshSearchQuestion() {
        this.questionKeyword = '';
        this.questionGroupId = null;
        this.searchQuestion(1);
    }

    refreshSearchQuestionQuestion() {
        this.questionGroupKeyword = '';
        this.searchQuestionGroup(1);
    }


    removeQuestion(question: any) {
        _.remove(this.listSelectedQuestions, (item: any) => {
            return item.id === question.id;
        });

        const questionInfo = _.find(this.listQuestions, (item: any) => {
            return item.id === question.id;
        });

        if (questionInfo) {
            questionInfo.isSelected = false;
        }
        this.calculateTotalSelectedQuestion();
    }

    removeQuestionGroup(questionGroup: any) {
        _.remove(this.listSelectedQuestionGroups, (item: any) => {
            return item.id === questionGroup.id;
        });

        const questionGroupInfo = _.find(this.listQuestionGroups, (item: any) => {
            return item.id === questionGroup.id;
        });

        if (questionGroupInfo) {
            questionGroupInfo.isSelected = false;
        }
        this.calculateTotalSelectedQuestion();
    }

    searchQuestion(currentPage: number) {
        this.currentQuestionPage = currentPage;
        this.isSearching = true;
        this.questionService.searchForSuggestion(this.questionKeyword, this.questionGroupId, this.currentQuestionPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<SuggestionViewModel<string>>) => {
                this.totalQuestionRows = result.totalRows;
                _.each(result.items, (item: SuggestionViewModel<string>) => {
                    const selectedItem = _.find(this.listSelectedQuestions, (question: SuggestionViewModel<string>) => {
                        return question.id === item.id;
                    });
                    item.isSelected = selectedItem != null && selectedItem !== undefined;
                });
                this.listQuestions = result.items;
            });
    }

    searchQuestionGroup(currentPage: number) {
        this.currentQuestionGroupPage = currentPage;
        this.isSearching = true;
        this.questionGroupService.searchForSelect(this.questionGroupKeyword, this.currentQuestionGroupPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: any) => {
                this.totalQuestionGroupRows = result.totalRows;
                _.each(result.items, (item: any) => {
                    const selectedItem = _.find(this.listSelectedQuestionGroups, (question: any) => {
                        return question.id === item.id;
                    });
                    item.isSelected = selectedItem != null && selectedItem !== undefined;
                });
                this.listQuestionGroups = result.items;
            });
    }

    accept() {
        this.accepted.emit({
            questions: this.listSelectedQuestions,
            questionGroups: this.listSelectedQuestionGroups,
            totalQuestion: this.totalSelectedQuestion
        });
        // this.resetSelectedStatus();
        this.questionSelectModal.dismiss();
    }

    private calculateTotalSelectedQuestion() {
        const totalSelectedQuestions = this.listSelectedQuestions.length;
        const totalSelectedQuestionGroups = _.sumBy(this.listSelectedQuestionGroups, (item) => {
            return item.totalQuestion;
        });
        this.totalSelectedQuestion = totalSelectedQuestions +
            (totalSelectedQuestionGroups != null && totalSelectedQuestionGroups !== undefined
                ? totalSelectedQuestionGroups
                : 0);
    }
}
