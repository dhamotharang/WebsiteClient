import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicePickerComponent } from './service-picker.component';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { NhModalModule } from '../nh-modal/nh-modal.module';
import { NHTreeModule } from '../nh-tree/nh-tree.module';
import { ServiceService } from './service.service';

@NgModule({
    imports: [CommonModule, NhModalModule, NHTreeModule, MatCheckboxModule, MatButtonModule],
    exports: [ServicePickerComponent],
    declarations: [ServicePickerComponent],
    providers: [ServiceService],
})
export class ServicePickerModule {
}
