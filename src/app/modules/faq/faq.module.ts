import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqFormComponent } from './faq-form/faq-form.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FaqListComponent, FaqFormComponent]
})
export class FaqModule { }
