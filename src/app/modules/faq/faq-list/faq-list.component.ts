import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {HelperService} from '../../../shareds/services/helper.service';
import {UtilService} from '../../../shareds/services/util.service';
import {FaqService} from '../service/faq.service';
import {FaqGroupViewModel} from '../model/faq-group.viewmodel';
import {FaqGroupFormComponent} from '../faq-group-form/faq-group-form.component';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-faq-list',
    templateUrl: './faq-list.component.html',
    styleUrls: ['./faq-list.component.scss'],
    providers: [HelperService, UtilService]
})
export class FaqListComponent extends BaseListComponent<FaqGroupViewModel> implements OnInit {
    @ViewChild(FaqGroupFormComponent) faqGroupForm: FaqGroupFormComponent;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private faqService: FaqService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE_CONFIG, this.pageId.FAQ);
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<FaqGroupViewModel> }) => {
            if (result.data) {
                this.listItems = result.data.items;
            }
        });
    }

    addGroup() {
        this.faqGroupForm.add();
    }

    updateGroup(item: FaqGroupViewModel) {
        this.faqGroupForm.update(item.id);
    }

    showAnswer(item) {
    }

    addQuestion() {
    }

    deleteGroup(item: FaqGroupViewModel) {
        this.faqService.deleteGroup(item.id).subscribe((data: ActionResultViewModel) => {
            if (data.code > 0) {
                this.search();
            }
        });
    }

    updateQuestion(item) {
    }

    deleteQuestion(item) {
    }

    search() {
        this.faqService.search('', null, 1, this.pageSize).subscribe(
            (data: SearchResultViewModel<FaqGroupViewModel>) => {
                this.listItems = data.items;
            });
    }
}
