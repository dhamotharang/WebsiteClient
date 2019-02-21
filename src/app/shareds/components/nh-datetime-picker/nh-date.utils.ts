import { ElementRef } from '@angular/core';

export class NhDateUtils {
    static isValidValue(mask, value) {
        const reg = mask
            .replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
            .replace(/_/g, '{digit+}')
            .replace(/([0-9]{1})/g, '{digit$1}')
            .replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
            .replace(/\{digit[\+]\}/g, '[0-9_]{1}');
        return (new RegExp(reg)).test(value);
    }

    static getCaretPos(elRef: ElementRef) {
        try {
            if (elRef.nativeElement.selection && elRef.nativeElement.selection.createRange) {
                const range = elRef.nativeElement.selection.createRange();
                return range.getBookmark().charCodeAt(2) - 2;
            }
            if (elRef.nativeElement.setSelectionRange) {
                return elRef.nativeElement.selectionStart;
            }
        } catch (e) {
            return 0;
        }
    }

    static setCaretPos(elRef: ElementRef, pos) {
        if (elRef.nativeElement.createTextRange) {
            const textRange = elRef.nativeElement.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd('character', pos);
            textRange.moveStart('character', pos);
            textRange.select();
            return true;
        }
        if (elRef.nativeElement.setSelectionRange) {
            elRef.nativeElement.setSelectionRange(pos, pos);
            return true;
        }
        return false;
    }
}
