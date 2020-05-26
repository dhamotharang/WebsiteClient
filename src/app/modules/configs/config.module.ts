import {NgModule} from '@angular/core';
import {PageComponent} from './page/page.component';
import {ConfigRoutingModule} from './config-routing.module';
import {NhSelectModule} from '../../shareds/components/nh-select/nh-select.module';
import {CommonModule} from '@angular/common';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule
} from '@angular/material';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {PageFormComponent} from './page/page-form.component';
import {ClientComponent} from './client/client.component';
import {ClientFormComponent} from './client/client-form.component';
import {ConfigComponent} from './config.component';
import {TenantComponent} from './tenant/tenant.component';
import {TenantFormComponent} from './tenant/tenant-form.component';
import {RoleComponent} from './role/role.component';
import {RoleFormComponent} from './role/role-form/role-form.component';
import {RoleDetailComponent} from './role/role-detail/role-detail.component';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {LanguageComponent} from './website/language/language.component';
import {NHTreeModule} from '../../shareds/components/nh-tree/nh-tree.module';
import {UserSettingComponent} from './user-setting/user-setting.component';
import {NhImageModule} from '../../shareds/components/nh-image/nh-image.module';
import {GhmSelectPickerModule} from '../../shareds/components/ghm-select-picker/ghm-select-picker.module';
import {CoreModule} from '../../core/core.module';
import {AccountComponent} from './account/account.component';
import {AccountFormComponent} from './account/account-form/account-form.component';
import {MenuFormComponent} from './menus/menu-form/menu-form.component';
import {MenuComponent} from './menus/menu.component';
import {MenuItemComponent} from './menus/menu-item/menu-item.component';
import {EmailComponent} from './email/email.component';
import {EmailFormComponent} from './email/email-form/email-form.component';
import {WebsiteInfoComponent} from './website/website-info/website-info.component';
import {SocialNetworkComponent} from './website/social-network/social-network.component';
import {WebsiteComponent} from './website/website.component';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import {BranchComponent} from './website/branch/branch.component';
import {BranchFormComponent} from './website/branch/branch-form/branch-form.component';
import {BranchItemComponent} from './website/branch/branch-item/branch-item.component';
import {LanguageFormComponent} from './website/language/language-form/language-form.component';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {EmailTemplateComponent} from './email/email-template/email-template.component';
import {EmailTemplateFormComponent} from './email/email-template/email-template-form/email-template-form.component';
import {NhDateModule} from '../../shareds/components/nh-datetime-picker/nh-date.module';
import {TinymceModule} from '../../shareds/components/tinymce/tinymce.module';
import {MenuItemFormComponent} from './menus/menu-item/menu-item-form/menu-item-form.component';
import {ApproverComponent} from './approver/approver.component';
import {GhmUserSuggestionModule} from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import {NhSuggestionModule} from '../../shareds/components/nh-suggestion/nh-suggestion.module';
import {NhDropdownModule} from '../../shareds/directives/nh-dropdown/nh-dropdown.module';
import {ChoiceMenuItemComponent} from './menus/choice-menu-item/choice-menu-item.component';
import {NewsModule} from '../news/news.module';
import {EmailTypeFormComponent} from './email/email-type/email-type-form/email-type-form.component';
import {EmailTypeComponent} from './email/email-type/email-type.component';
import {CoreValuesComponent} from './website/core-values/core-values.component';
import {CoreValuesFormComponent} from './website/core-values/core-values-form/core-values-form.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {GhmSelectModule} from '../../shareds/components/ghm-select/ghm-select.module';
import {NhUserPickerModule} from '../../shareds/components/nh-user-picker/nh-user-picker.module';
import {ProductSelectComponent} from './menus/choice-menu-item/product-select/product-select.component';
import {ProductCategorySelectComponent} from './menus/choice-menu-item/product-category-select/product-category-select.component';

@NgModule({
    imports: [
        CommonModule, ConfigRoutingModule, NhSelectModule, NhImageModule, TinymceModule,
        MatCheckboxModule, MatPaginatorModule, MatButtonModule, MatSlideToggleModule, DatetimeFormatModule, NhDateModule, NhDropdownModule,
        NhModalModule, ReactiveFormsModule, FormsModule, MatTooltipModule, NHTreeModule, GhmFileExplorerModule, GhmUserSuggestionModule,
        MatTabsModule, NhSuggestionModule, MatIconModule, NewsModule, DragDropModule, GhmSelectModule, NhUserPickerModule,
        GhmSelectPickerModule, CoreModule, GhmPagingModule, SweetAlert2Module.forRoot()
    ],
    exports: [],
    declarations: [PageComponent, PageFormComponent, ClientComponent, AccountComponent, AccountFormComponent,
        ClientFormComponent, ConfigComponent, TenantComponent, TenantFormComponent, RoleComponent, RoleFormComponent, RoleDetailComponent,
        LanguageComponent, UserSettingComponent, MenuFormComponent, MenuComponent, MenuItemComponent, WebsiteInfoComponent,
        SocialNetworkComponent, EmailComponent, EmailFormComponent, WebsiteComponent, BranchComponent, BranchFormComponent,
        BranchItemComponent, LanguageFormComponent, EmailTemplateComponent, EmailTemplateFormComponent, MenuItemFormComponent,
        ApproverComponent, ChoiceMenuItemComponent, EmailTypeFormComponent, EmailTypeComponent, CoreValuesComponent, CoreValuesFormComponent,
        ProductSelectComponent, ProductCategorySelectComponent
    ],
    entryComponents: [
        ProductSelectComponent, ProductCategorySelectComponent
    ],
    providers: [],
})
export class ConfigModule {
}
