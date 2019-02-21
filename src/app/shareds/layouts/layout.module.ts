import { NgModule } from '@angular/core';
import { CommonModule, PathLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { LayoutComponent } from './layout.component';
import { LayoutDirective } from './layout.directive';
import { Admin1HeaderComponent } from './admin-1/header/admin-1-header.component';
import { Admin1SidebarComponent } from './admin-1/sidebar/admin-1-sidebar.component';
import { Admin1FooterComponent } from './admin-1/footer/admin-1-footer.component';
import { Admin1LayoutComponent } from './admin-1/admin-1-layout.component';
import { Admin2HeaderComponent } from './admin-2/header/admin-2-header.component';
import { Admin2SidebarComponent } from './admin-2/sidebar/admin-2-sidebar.component';
import { Admin2FooterComponent } from './admin-2/footer/admin-2-footer.component';
import { Admin2LayoutComponent } from './admin-2/admin-2-layout.component';
import { APP_CONFIG, APP_CONFIG_DI } from '../../configs/app.config';
import { PAGE_ID, PAGE_ID_DI } from '../../configs/page-id.config';
import { Admin1SidebarItemComponent } from './admin-1/sidebar/admin-1-sidebar-item.component';
import { CoreModule } from '../../core/core.module';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { NhModalModule } from '../components/nh-modal/nh-modal.module';

@NgModule({
    imports: [CommonModule, RouterModule, MatButtonModule, MatCheckboxModule, MatTooltipModule,
        ReactiveFormsModule, FormsModule, CoreModule, NhModalModule
    ],
    declarations: [LayoutComponent, LayoutDirective,
        NotificationItemComponent, ChangePasswordComponent,
        // Admin 1 templates.
        Admin1LayoutComponent, Admin1HeaderComponent, Admin1SidebarComponent, Admin1FooterComponent,
        Admin1SidebarItemComponent,
        // Admin 2 template
        Admin2LayoutComponent, Admin2HeaderComponent, Admin2SidebarComponent, Admin2FooterComponent
    ],
    exports: [LayoutComponent],
    entryComponents: [Admin1LayoutComponent, Admin2LayoutComponent],
    providers: [
        {provide: APP_CONFIG, useValue: APP_CONFIG_DI},
        {provide: PAGE_ID, useValue: PAGE_ID_DI},
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
    ]
})

export class LayoutModule {
}
