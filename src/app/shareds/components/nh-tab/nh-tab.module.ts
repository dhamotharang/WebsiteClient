/**
 * Created by Administrator on 6/18/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { NhTabService } from './nh-tab.service';

import { NhTabComponent } from './nh-tab.component';
import { NhTabPaneComponent } from './nh-tab-pane.component';

// Directives
import { NhTabHostDirective } from './nh-tab-host.directive';
import { NhTabTitleDirective } from './nh-tab-title.directive';
import { NhTabTitleComponent } from './nh-tab-title.component';

@NgModule({
    imports: [CommonModule],
    exports: [NhTabComponent, NhTabPaneComponent, NhTabTitleDirective],
    declarations: [NhTabComponent, NhTabPaneComponent, NhTabHostDirective, NhTabTitleDirective, NhTabTitleComponent]
})
export class NhTabModule {
}
