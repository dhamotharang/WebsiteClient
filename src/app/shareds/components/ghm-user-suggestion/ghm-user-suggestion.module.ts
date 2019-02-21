import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhmUserSuggestionComponent } from './ghm-user-suggestion.component';
import { GhmUserSuggestionService } from './ghm-user-suggestion.service';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [GhmUserSuggestionComponent],
    declarations: [GhmUserSuggestionComponent],
    providers: [GhmUserSuggestionService],
})
export class GhmUserSuggestionModule {
}
