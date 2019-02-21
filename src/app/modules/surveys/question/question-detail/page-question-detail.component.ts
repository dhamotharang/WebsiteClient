import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionDetailComponent } from './question-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../base-form.component';

@Component({
    selector: 'app-survey-page-question-detail',
    templateUrl: './page-question-detail.component.html',
    providers: []
})

export class PageQuestionDetailComponent extends BaseFormComponent implements OnInit {
    @ViewChild(QuestionDetailComponent) questionDetailComponent: QuestionDetailComponent;

    constructor( private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.subscribers.routeData = this.route.data.subscribe((data: { versionId: string }) => {
            const versionId = data.versionId;
            this.questionDetailComponent.getDetail(versionId);
        });
    }
}
