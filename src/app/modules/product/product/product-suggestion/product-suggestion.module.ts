import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NhSuggestionModule} from '../../../../shareds/components/nh-suggestion/nh-suggestion.module';
import {ProductSuggestionComponent} from './product-suggestion.component';
import {ProductService} from '../service/product.service';

@NgModule({
    imports: [
        CommonModule, FormsModule, NhSuggestionModule
    ],
    declarations: [ProductSuggestionComponent],
    exports: [ProductSuggestionComponent],
    providers: [ProductService]
})
export class ProductSuggestionModule {
}
