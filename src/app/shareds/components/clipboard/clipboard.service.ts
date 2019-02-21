import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class ClipboardService {
    private dom: Document;

    constructor( @Inject(DOCUMENT) dom: Document) {
        this.dom = dom;
    }

    copy(value: string): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            let textarea = null;
            try {
                textarea = this.dom.createElement('textarea');
                textarea.style.height = '0px';
                textarea.style.left = '-100px';
                textarea.style.opacity = '';
                textarea.style.position = 'fixed';
                textarea.style.top = '-100px';
                textarea.style.width = '0px';
                this.dom.body.appendChild(textarea);

                // Set and select the value (creating an active selection range).
                textarea.value = value;
                textarea.select();

                // Ask the browser to copy the current selection to the clipboard.
                this.dom.execCommand('copy');
                resolve(value);
            } finally {
                if (textarea && textarea.parentNode) {
                    textarea.parentNode.removeChild(textarea);
                }
            }
        });
        return promise;
    }
}
