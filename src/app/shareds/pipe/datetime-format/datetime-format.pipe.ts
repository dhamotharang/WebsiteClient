import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateTimeFormat' })
export class DateTimeFormatPipe implements PipeTransform {
    private _inputDateTimeAllowedFormat = [
        'DD/MM/YYYY',
        'DD/MM/YYYY HH:mm',
        'DD/MM/YYYY HH:mm:ss',
        'DD/MM/YYYY HH:mm Z',
        'DD-MM-YYYY',
        'DD-MM-YYYY HH:mm',
        'DD-MM-YYYY HH:mm:ss',
        'DD-MM-YYYY HH:mm Z',
        // --------------------
        'MM/DD/YYYY',
        'MM/DD/YYYY HH:mm',
        'MM/DD/YYYY HH:mm:ss',
        'MM/DD/YYYY HH:mm Z',
        'MM-DD-YYYY',
        'MM-DD-YYYY HH:mm',
        'MM-DD-YYYY HH:mm:ss',
        'MM-DD-YYYY HH:mm Z',
        // --------------------
        'YYYY/MM/DD',
        'YYYY/MM/DD HH:mm',
        'YYYY/MM/DD HH:mm:ss',
        'YYYY/MM/DD HH:mm Z',
        'YYYY-MM-DD',
        'YYYY-MM-DD HH:mm',
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DD HH:mm Z',
        // --------------------
        'YYYY/DD/MM',
        'YYYY/DD/MM HH:mm',
        'YYYY/DD/MM HH:mm:ss',
        'YYYY/DD/MM HH:mm Z',
        'YYYY-DD-MM',
        'YYYY-DD-MM HH:mm',
        'YYYY-DD-MM HH:mm:ss',
        'YYYY-DD-MM HH:mm Z',
    ];

    transform(value: string, exponent: string, isUtc: boolean = false) {
        return this.formatDate(value, exponent, isUtc);
    }

    formatDate(value, format, isUtc = false) {
        if (!moment(value, this._inputDateTimeAllowedFormat).isValid()) {
            return '';
        }
        return isUtc ? moment.utc(value, this._inputDateTimeAllowedFormat).format(format)
            : moment(value, this._inputDateTimeAllowedFormat).format(format);
        // return value;
    }
}
