import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteRoutingModule } from './website-routing.module';
import { WebsiteComponent } from './website.component';
import { CategoryComponent } from './category/category.component';
import { CategoryFormComponent } from './category/category-form/category-form.component';
import { PromotionListComponent } from './promotions/promotion-list/promotion-list.component';
import { PromotionDetailComponent } from './promotions/promotion-detail/promotion-detail.component';
import { PromotionFormComponent } from './promotions/promotion-form/promotion-form.component';
import { PromotionVoucherFormComponent } from './promotions/promotion-voucher-form/promotion-voucher-form.component';
import { PromotionSubjectListComponent } from './promotions/promotion-subject-list/promotion-subject-list.component';
import { LayoutModule } from '../../shareds/layouts/layout.module';
import { NewsComponent } from './news/news.component';
import { NhSelectModule } from '../../shareds/components/nh-select/nh-select.module';
import { NhModalModule } from '../../shareds/components/nh-modal/nh-modal.module';
import { NHTreeModule } from '../../shareds/components/nh-tree/nh-tree.module';
import { NhUploadModule } from '../../shareds/components/nh-upload/nh-upload.module';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { NhDateModule } from '../../shareds/components/nh-datetime-picker/nh-date.module';
import { DatetimeFormatModule } from '../../shareds/pipe/datetime-format/datetime-format.module';
import { FormatNumberModule } from '../../shareds/pipe/format-number/format-number.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '../../shareds/components/clipboard/clipboard.module';
import { PromotionVoucherListComponent } from './promotions/promotion-voucher-list.component/promotion-voucher-list.component';
import { NhWizardModule } from '../../shareds/components/nh-wizard/nh-wizard.module';
import { TinymceModule } from '../../shareds/components/tinymce/tinymce.module';
import { ServicePickerModule } from '../../shareds/components/service-picker/service-picker.module';
import { CourseComponent } from './course/course.component';
import { CourseFormComponent } from './course/course-form/course-form.component';
import { ClassComponent } from './course/class/class.component';
import { CourseRegisterComponent } from './course/course-register/course-register.component';
import { CourseRegisterFormComponent } from './course/course-register/course-register-form/course-register-form.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ClassFormComponent } from './course/class/class-form/class-form.component';
import { NewsFormComponent } from './news/news-form/news-form.component';
import { MenuComponent } from './menu/menu.component';
import { MenuFormComponent } from './menu/menu-form/menu-form.component';
import { CategoryPickerComponent } from './category/category-picker/category-picker.component';
import { NewsPickerComponent } from './news/news-picker/news-picker.component';
import { GhmMutilSelectModule } from '../../shareds/components/ghm-multi-select/ghm-mutil-select.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
    imports: [CommonModule, CoreModule, WebsiteRoutingModule, LayoutModule, NhModalModule, NhSelectModule, NHTreeModule, NhUploadModule,
        GhmPagingModule, CoreModule,
        MatIconModule, MatButtonModule, MatCheckboxModule, MatMenuModule, NhDateModule, DatetimeFormatModule, FormatNumberModule,
        FormsModule, ReactiveFormsModule, ClipboardModule, NhWizardModule, TinymceModule, MatTooltipModule, ServicePickerModule,
        SweetAlert2Module, GhmMutilSelectModule],
    exports: [],
    declarations: [
        WebsiteComponent, CategoryComponent, CategoryFormComponent, PromotionListComponent, PromotionDetailComponent,
        PromotionFormComponent,
        PromotionVoucherListComponent, PromotionVoucherFormComponent, PromotionSubjectListComponent,
        NewsComponent, CourseComponent, CourseFormComponent, ClassComponent, CourseRegisterComponent, CourseRegisterFormComponent,
        ClassFormComponent, NewsFormComponent, MenuComponent, MenuFormComponent,
        CategoryPickerComponent, NewsPickerComponent
    ],
    providers: [],
})
export class WebsiteModule {
}
