import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../../base-list.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {UtilService} from '../../../../shareds/services/util.service';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {finalize} from 'rxjs/operators';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {EmailTypeFormComponent} from './email-type-form/email-type-form.component';
import {EmailType} from './email-type.model';
import {EmailTypeService} from './email-type.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-config-email-type',
    templateUrl: './email-type.component.html',
    providers: [EmailTypeService]
})

export class EmailTypeComponent extends BaseListComponent<EmailType> implements OnInit {
    @ViewChild(EmailTypeFormComponent) emailTypeFormComponent: EmailTypeFormComponent;
    listEmailType: EmailType[];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private emailTypeService: EmailTypeService,
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
        this.emailTypeService.search(this.currentPage, this.pageSize).pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<EmailType>) => {
                this.totalRows = result.totalRows;
                this.listEmailType = result.items;
                return result.items;
            });
    }

    add() {
        this.emailTypeFormComponent.add();
    }

    edit(emailType) {
        this.emailTypeFormComponent.edit(emailType);
    }

    delete(id: string) {
        this.emailTypeService.delete(id).subscribe((result: ActionResultViewModel) => {
            _.remove(this.listEmailType, (item: EmailType) => {
                return item.id === id;
            });
        });
    }
}