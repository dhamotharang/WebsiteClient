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
import {FaqGroupViewModel, FaqViewModel} from '../model/faq-group.viewmodel';
import {FaqGroupFormComponent} from '../faq-group-form/faq-group-form.component';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {FaqFormComponent} from '../faq-form/faq-form.component';
import * as _ from 'lodash';
import {Faq} from '../model/faq.model';
import {FaqGroup} from '../model/faq-group.model';

@Component({
    selector: 'app-faq-list',
    templateUrl: './faq-list.component.html',
    styleUrls: ['./faq-list.component.scss'],
    providers: [HelperService, UtilService]
})
export class FaqListComponent extends BaseListComponent<FaqGroupViewModel> implements OnInit {
    @ViewChild(FaqGroupFormComponent) faqGroupForm: FaqGroupFormComponent;
    @ViewChild(FaqFormComponent) faqForm: FaqFormComponent;

    listFaqGroupSuggestion;

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
                this.renderListFaqGroupSuggestion();
            }
        });
    }

    addGroup() {
        this.faqGroupForm.add();
    }

    updateGroup(item: FaqGroupViewModel) {
        this.faqGroupForm.update(item.id);
    }

    changeFaqGroupOrder(item: FaqGroupViewModel) {
        const faqModel = this.getFaqGroupModel(item);
        this.faqService.updateGroup(item.id, faqModel).subscribe((result: ActionResultViewModel) => {
        });
    }

    changeFaqGroupStatus(item: FaqGroupViewModel) {
        const faqModel = this.getFaqGroupModel(item);
        faqModel.isActive = !item.isActive;
        this.faqService.updateGroup(item.id, faqModel).subscribe((result: ActionResultViewModel) => {
            if (result.code > 0) {
                item.isActive = !item.isActive;
            }
        });
    }


    addQuestion(item: FaqGroupViewModel) {
        this.faqForm.add(item.id);
    }

    deleteGroup(item: FaqGroupViewModel) {
        this.faqService.deleteGroup(item.id).subscribe((data: ActionResultViewModel) => {
            if (data.code > 0) {
                this.search();
            }
        });
    }

    updateQuestion(item: FaqViewModel) {
        const faqModel = this.getFaqModel(item);
        this.faqService.update(item.id, faqModel).subscribe((result: ActionResultViewModel) => {
        });
    }

    changeStatusQuestion(item: FaqViewModel) {
        const faqModel = this.getFaqModel(item);
        faqModel.isActive = !item.isActive;
        this.faqService.update(item.id, faqModel).subscribe((result: ActionResultViewModel) => {
            if (result.code > 0) {
                item.isActive = !item.isActive;
            }
        });
    }

    changeOrderQuestion(item: FaqViewModel) {

    }

    deleteQuestion(item: FaqViewModel) {
        this.faqService.delete(item.id).subscribe((data: ActionResultViewModel) => {
            if (data.code > 0) {
                this.search();
            }
        });
    }

    search() {
        this.faqService.search('', null, 1, this.pageSize).subscribe(
            (data: SearchResultViewModel<FaqGroupViewModel>) => {
                this.listItems = data.items;
                this.renderListFaqGroupSuggestion();
            });
    }

    renderListFaqGroupSuggestion() {
        this.listFaqGroupSuggestion = _.map(this.listItems, (item: FaqGroupViewModel) => {
            return {id: item.id, name: item.name};
        });
    }

    private getFaqGroupModel(item: FaqGroupViewModel): FaqGroup {
        const faqGroup = new FaqGroup();
        faqGroup.order = item.order;
        faqGroup.concurrencyStamp = item.concurrencyStamp;
        faqGroup.isActive = item.isActive;
        faqGroup.isQuickUpdate = true;

        return faqGroup;
    }

    private getFaqModel(item: FaqViewModel): Faq {
        const faq = new Faq();
        faq.order = item.order;
        faq.concurrencyStamp = item.concurrencyStamp;
        faq.isActive = item.isActive;
        faq.faqGroupId = item.faqGroupId;
        faq.isQuickUpdate = true;

        return faq;
    }
}
