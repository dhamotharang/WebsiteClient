import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { Answer } from '../models/answer.model';
import { QuestionType } from '../models/question.model';
import * as _ from 'lodash';
import { AnswerTranslation } from '../models/answer-translation.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-survey-answer',
    templateUrl: './answer.component.html',
    providers: [QuestionService]
})

export class AnswerComponent implements AfterViewInit {
    @Input() type;
    @Input() listLanguage;
    @Input() languageId;
    @Input() listAnswer: Answer[] = [];
    @Input() isUpdate;
    @Input() score;
    @Output() onSelectAnswer = new EventEmitter<Answer[]>();
    questionType = QuestionType;

    constructor(private toastr: ToastrService,
                private questionService: QuestionService) {
    }

    ngAfterViewInit() {
        this.insertListAnswerDefault();
    }

    removeAnswer(answer, i) {
        if ((this.type === QuestionType.singleChoice || this.type === QuestionType.multiChoice)
            && (!this.listAnswer || this.listAnswer.length <= 2)) {
            this.toastr.error('Question has least 2 answer.');
            return;
        }
        // if (this.isUpdate) {
        // } else {
            _.pullAt(this.listAnswer, [i]);
            if (this.listAnswer && this.listAnswer.length > 0) {
                _.each(this.listAnswer, (item, index) => {
                    item.order = index + 1;
                });
            }
        // }
    }

    addNewAnswer() {
        const answer = new Answer();
        if (this.listLanguage) {
            _.each(this.listLanguage, (item, index) => {
                const answerTranslation = new AnswerTranslation();
                answerTranslation.languageId = item.id;
                answerTranslation.name = '';
                answer.answerTranslations.push(answerTranslation);
            });
            answer.order = !this.listAnswer ? 0 : this.listAnswer.length + 1;
            this.listAnswer.push(answer);
            this.onSelectAnswer.emit(this.listAnswer);
        }
    }

    changeIsCorrectStatus(answer: Answer) {
        if (this.type === QuestionType.singleChoice) {
            _.each(this.listAnswer, (item) => {
                item.isCorrect = false;
            });
        }

        answer.isCorrect = !answer.isCorrect;
    }

    answerButtonTitleKeyup(answer, value) {
    }

    renderAnswerVote(count: number) {
        if (count > 0) {
            let stars = '';
            for (let i = 0; i < count; i++) {
                stars += '<i class="fa fa-star-o fontSize24 color-orange cm-mgr-5"></i>';
            }
            return stars;
        }
    }
    private insertListAnswerDefault() {
        if ((!this.listAnswer || this.listAnswer.length === 0) && this.listLanguage) {
            for (let i = 1; i <= 4; i++) {
                const answer = new Answer();
                _.each(this.listLanguage, (item, index) => {
                    const answerTranslation = new AnswerTranslation();
                    answerTranslation.languageId = item.id;
                    answerTranslation.name = '';
                    answer.answerTranslations.push(answerTranslation);
                });
                answer.order = i;
                this.listAnswer.push(answer);
                this.onSelectAnswer.emit(this.listAnswer);
            }
        }
    }
}
