import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {EmailSearchViewModel} from './viewmodel/email-search.viewmodel';
import {EmailService} from './service/email.service';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {UtilService} from '../../../shareds/services/util.service';
import {FilterLink} from '../../../shareds/models/filter-link.model';
import {EmailFormComponent} from './email-form/email-form.component';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {EmailTemplateComponent} from './email-template/email-template.component';
import {finalize, map} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {EmailTypeComponent} from './email-type/email-type.component';
import * as _ from 'lodash';
import {EmailDetailViewModel} from './viewmodel/email-detail.viewmodel';

@Component({
    selector: 'app-config-email',
    templateUrl: './email.component.html',
    providers: [EmailService]
})
export class EmailComponent extends BaseListComponent<EmailSearchViewModel> implements OnInit {
    @ViewChild(EmailFormComponent, {static: true}) emailFormComponent: EmailFormComponent;
    @ViewChild(EmailTemplateComponent, {static: true}) emailTemplateComponent: EmailTemplateComponent;
    @ViewChild(EmailTypeComponent, {static: true}) emailTypeComponent: EmailTypeComponent;
    listEmail;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private emailService: EmailService,
                private router: Router,
                private location: Location,
                private utilService: UtilService,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE_CONFIG, this.pageId.CONFIG_EMAIL);
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });

        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.emailService.search(this.currentPage, this.pageSize).pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<EmailSearchViewModel>) => {
                this.totalRows = result.totalRows;
                this.listEmail = result.items;
            });
    }

    add() {
        this.emailFormComponent.add();
    }

    edit(email: EmailSearchViewModel) {
        this.emailFormComponent.edit(email);
    }

    delete(id: string) {
        this.emailService.delete(id).subscribe((result: ActionResultViewModel) => {
            _.remove(this.listEmail, (item: EmailSearchViewModel) => {
                return item.id === id;
            });
        });
    }

    searchEmailTemplate() {
        this.emailTemplateComponent.search(1);
    }

    searchEmailType() {
        this.emailTypeComponent.search(1);
    }

    private renderFilterLink() {
        const path = 'config/emails';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
