import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NhTagComponent } from './nh-tag.component';
import {TagService} from './tag.service';

@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [NhTagComponent],
    declarations: [NhTagComponent],
    providers: [TagService],
})
export class NhTagModule {}
