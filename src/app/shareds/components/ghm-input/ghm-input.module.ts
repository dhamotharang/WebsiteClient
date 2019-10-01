import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import {GhmInputComponent} from './ghm-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import {DxBoxModule} from 'devextreme-angular';

@NgModule({
    imports: [CommonModule, FormsModule, MatInputModule, ReactiveFormsModule, DxBoxModule],
    declarations: [GhmInputComponent],
    exports: [GhmInputComponent]
})

export class GhmInputModule {
}
