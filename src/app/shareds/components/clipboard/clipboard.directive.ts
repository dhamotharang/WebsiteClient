import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ClipboardService } from './clipboard.service';

@Directive({
    selector: '[clipboard]'
})
export class ClipboardDirective {
    @Input() clipboard: string;
    @Output() copyEvent = new EventEmitter();
    @Output() errorEvent = new EventEmitter();

    constructor(private clipboardService: ClipboardService) {
    }

    @HostListener('click', ['$event.target'])
    copyToClipboard() {
        this.clipboardService.copy(this.clipboard)
            .then((value: string) => {
                this.copyEvent.emit(value);
            })
            .catch((error: Error) => {
                this.errorEvent.emit(error);
            });
    }
}
