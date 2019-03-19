import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhmUserSuggestionComponent } from './ghm-user-suggestion.component';
import { GhmUserSuggestionService } from './ghm-user-suggestion.service';
import { FormsModule } from '@angular/forms';
import {CoreModule} from '../../../core/core.module';

@NgModule({
    imports: [CommonModule, FormsModule, CoreModule],
    exports: [GhmUserSuggestionComponent],
    declarations: [GhmUserSuggestionComponent],
    providers: [GhmUserSuggestionService],
})
export class GhmUserSuggestionModule {
}
