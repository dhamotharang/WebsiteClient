/**
 * Created by HoangNH on 5/5/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Directives
import { NhDismissDirective } from './nh-dismiss.directive';

// Components
import { NhModalComponent } from './nh-modal.component';
import { NhModalHeaderComponent } from './nh-modal-header.component';
import { NhModalContentComponent } from './nh-modal-content.component';
import { NhModalFooterComponent } from './nh-modal-footer.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { NhModalService } from './nh-modal.service';

@NgModule({
    imports: [CommonModule, OverlayModule],
    exports: [NhModalComponent, NhModalHeaderComponent, NhModalContentComponent, NhModalFooterComponent,
        NhDismissDirective
    ],
    declarations: [NhModalComponent, NhModalHeaderComponent, NhModalContentComponent, NhModalFooterComponent,
        // Internal components/directives
        NhDismissDirective
    ],
    providers: [NhModalService],
})
export class NhModalModule {
}
