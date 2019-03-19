import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ghmCurrency'
})
export class GhmCurrencyPipe implements PipeTransform {
    private j: any;

    transform(value: any, fixedNumber: number, radixPoint?: string, decimalPoint?: string): any {
        return this.formatMoney(value, fixedNumber, decimalPoint, radixPoint);
    }

    formatMoney(n, c, d?: string, t?: string) {
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d === undefined ? ',' : d;
        t = t === undefined ? '.' : t;
        const s = n < 0 ? '-' : '',
            i: any = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
        this.j = (this.j = i.length) > 3 ? this.j % 3 : 0;

        return s + (this.j ? i.substr(0, this.j) + t : '') + i.substr(this.j).replace(/(\d{3})(?=\d)/g, '$1' + t)
            + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    }
}
