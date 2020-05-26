import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {BaseFormComponent} from '../../../base-form.component';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {WebsiteService} from './service/website.service';
import {LanguageComponent} from './language/language.component';
import {BranchComponent} from './branch/branch.component';
import {SocialNetworkComponent} from './social-network/social-network.component';
import {CoreValuesComponent} from './core-values/core-values.component';

@Component({
    selector: 'app-info-website',
    templateUrl: './website.component.html',
    providers: [WebsiteService]
})

export class WebsiteComponent extends BaseFormComponent implements OnInit {
    @ViewChild(LanguageComponent, {static: true}) languageComponent: LanguageComponent;
    @ViewChild(BranchComponent, {static: true}) branchComponent: BranchComponent;
    @ViewChild(CoreValuesComponent, {static: true}) coreValueComponent: CoreValuesComponent;
    @ViewChild(SocialNetworkComponent, {static: true}) socialNetworkComponent: SocialNetworkComponent;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE_CONFIG, this.pageId.CONFIG_WEBSITE);
    }

    searchLanguage() {
        this.languageComponent.search();
    }

    searchBranch() {
        this.branchComponent.search(1);
    }

    searchSocialNetwork() {
        this.socialNetworkComponent.search();
    }

    searchCoreValue() {
        this.coreValueComponent.search(1);
    }
}
