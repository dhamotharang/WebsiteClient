import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NhSuggestionService } from './nh-suggestion.service';
import { NhSuggestionComponent } from './nh-suggestion.component';
import {CoreModule} from '../../../core/core.module';

@NgModule({
    imports: [CommonModule, FormsModule, CoreModule],
    declarations: [NhSuggestionComponent],
    exports: [NhSuggestionComponent],
    providers: [NhSuggestionService],
})
export class NhSuggestionModule {
}
