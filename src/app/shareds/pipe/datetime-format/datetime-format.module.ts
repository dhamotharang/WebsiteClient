import { NgModule } from '@angular/core';
import { DateTimeFormatPipe } from './datetime-format.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    exports: [DateTimeFormatPipe],
    declarations: [DateTimeFormatPipe],
    providers: [],
})
export class DatetimeFormatModule {
}
