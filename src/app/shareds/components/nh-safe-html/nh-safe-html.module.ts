/**
 * Created by Nam on 4/20/2017.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NhSafeHtmlComponent, SafeHtmlPipe } from './nh-safe-html.component';

@NgModule({
    imports: [FormsModule],
    exports: [NhSafeHtmlComponent],
    declarations: [NhSafeHtmlComponent, SafeHtmlPipe],
    providers: [],
})
export class NhSafeHtmlModeule {

}

