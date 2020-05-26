import {NgModule} from '@angular/core';
import {EventListComponent} from './event-list/event-list.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {LayoutModule} from '../../shareds/layouts/layout.module';
import {NhSelectModule} from '../../shareds/components/nh-select/nh-select.module';
import {NhImageModule} from '../../shareds/components/nh-image/nh-image.module';
import {NhUserPickerModule} from '../../shareds/components/nh-user-picker/nh-user-picker.module';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTooltipModule
} from '@angular/material';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {NHTreeModule} from '../../shareds/components/nh-tree/nh-tree.module';
import {GhmSelectPickerModule} from '../../shareds/components/ghm-select-picker/ghm-select-picker.module';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {TinymceModule} from '../../shareds/components/tinymce/tinymce.module';
import {EventRoutingModule} from './event-routing.module';
import {NhDateModule} from '../../shareds/components/nh-datetime-picker/nh-date.module';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {EventFormComponent} from './event-form/event-form.component';
import {EventDayComponent} from './event-day/event-day.component';
import {EventDayFormComponent} from './event-day-form/event-day-form.component';
import {AccordionModule} from 'primeng';
import {NhWizardModule} from '../../shareds/components/nh-wizard/nh-wizard.module';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
// import { GhmContextMenuModule } from '../../shareds/directives/ghm-context-menu/ghm-context-menu.module';
import {GhmUserSuggestionModule} from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import {EventDetailComponent} from './event-detail/event-detail.component';
import {EventDayDetailComponent} from './event-day-detail/event-day-detail.component';
import {EventRegisterComponent} from './event-register/event-register.component';
import {NhSuggestionModule} from '../../shareds/components/nh-suggestion/nh-suggestion.module';
import {EventRegisterListComponent} from './event-register-list/event-register-list.component';
import {EventRegisterDetailComponent} from './event-register-detail/event-register-detail.component';
import {NhDropdownModule} from '../../shareds/directives/nh-dropdown/nh-dropdown.module';
import {GalleryModule} from '../gallery/gallery.module';
import {EventAlbumComponent} from './event-album/event-album.component';
import {EventAlbumFormComponent} from './event-album/event-album-form/event-album-form.component';

@NgModule({
    imports: [CommonModule, EventRoutingModule, NhSelectModule, NhImageModule, NhUserPickerModule,
        MatCheckboxModule, MatPaginatorModule, MatButtonModule, MatSlideToggleModule, TinymceModule, DatetimeFormatModule,
        NhModalModule, ReactiveFormsModule, FormsModule, MatTooltipModule, NHTreeModule, NhDateModule, AccordionModule,
        NhWizardModule, GhmFileExplorerModule, GhmUserSuggestionModule, MatSnackBarModule, NhSuggestionModule,
        MatRadioModule, NhDropdownModule, MatIconModule, GalleryModule,
        GhmSelectPickerModule, CoreModule, GhmPagingModule, SweetAlert2Module.forRoot()],
    exports: [],
    declarations: [EventListComponent, EventFormComponent, EventDayComponent, EventDayFormComponent, EventDetailComponent,
        EventDayDetailComponent, EventRegisterComponent, EventRegisterListComponent, EventRegisterDetailComponent, EventAlbumComponent,
        EventAlbumFormComponent],
    providers: [],
})
export class EventModule {
}
