import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {EmailTemplateSearchViewModel} from './viewmodel/email-template-search.viewmodel';
import {BaseListComponent} from '../../../../base-list.component';
import {EmailTemplateFormComponent} from './email-template-form/email-template-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {EmailTemplateService} from './email-template.service';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {UtilService} from '../../../../shareds/services/util.service';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {finalize} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import * as _ from 'lodash';

@Component({
    selector: 'app-config-email-template',
    templateUrl: './email-template.component.html',
    providers: [EmailTemplateService]
})

export class EmailTemplateComponent extends BaseListComponent<EmailTemplateSearchViewModel> implements OnInit {
    @ViewChild(EmailTemplateFormComponent, {static: true}) emailTemplateFormComponent: EmailTemplateFormComponent;
    listStatus = [
        {id: true, name: 'Active'},
        {id: false, name: 'InActive'}];
    status;
    listEmailTemplate: EmailTemplateSearchViewModel[];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private emailTemplateService: EmailTemplateService,
                private router: Router,
                private utilService: UtilService,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE_CONFIG, this.pageId.CONFIG_EMAIL);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.emailTemplateService.search(this.currentPage, this.pageSize).pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<EmailTemplateSearchViewModel>) => {
                this.totalRows = result.totalRows;
                this.listEmailTemplate = result.items;
                return result.items;
            });
    }

    add() {
        this.emailTemplateFormComponent.add();
    }

    edit(id: string) {
        this.emailTemplateFormComponent.edit(id);
    }

    delete(id: string) {
        this.emailTemplateService.delete(id).subscribe((result: ActionResultViewModel) => {
            _.remove(this.listEmailTemplate, (item: EmailTemplateSearchViewModel) => {
                return item.id === id;
            });
        });
    }

    resetFormSearch() {
        this.keyword = '';
        this.search(1);
    }
}
