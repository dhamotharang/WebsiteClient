import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatMoneyString'})
export class FormatMoneyStringPipe implements PipeTransform {
    private j: any;

    transform(value: number, exponent?: string) {
        return this.convertMoneyToString(value, '');
    }

    convertMoneyToString(money: number, exponent: string) {
        const moneyString = this.formatMoney(money, exponent, ',', ',');
        const groups = moneyString.split(',');
        const groupLength = groups.length;
        let str = '';
        for (let i = groupLength; i > 0; i--) {
            const kq = this.groupThousand(groups[groupLength - i], groupLength === i, i === 1);
            str += str === '' ? kq + (kq === '' || kq === ' ' ? '' : (i === 6 ? ' triệu ' : i === 5 ? ' nghìn ' : i === 4 ?
                ' tỷ ' : i === 3 ? ' triệu ' : i === 2 ? ' nghìn ' : '')) :
                ' ' + kq + (kq === '' || kq === ' ' ? '' : (i === 6 ? ' triệu ' : i === 5 ? ' nghìn ' : i === 4 ?
                ' tỷ ' : i === 3 ? ' triệu ' : i === 2 ? ' nghìn ' : ''));
        }

        return str + (moneyString.length >= 17 && groups[2] === '000' && groups[3] === '000' && groups[4] === '000' ? ' tỷ' : '');
    }

    groupThousand(value, isFirst, isLast) {
        value = parseInt(value);
        // console.log(value);
        const tram = Math.floor(value / 100);
        const chuc = Math.floor((value - tram * 100) / 10);
        const donvi = (value - tram * 100 - chuc * 10);
        return (tram === 0 && isFirst || tram === 0 && chuc === 0 && donvi === 0 ? '' : this.numericToVietnamese(tram) + ' trăm ') +
            (chuc === 0 && donvi === 0 ? '' : (chuc === 0 && !isFirst || tram > 0 && chuc === 0 && isFirst ?
                'linh' : tram === 0 && chuc === 1 && donvi === 0 && !isFirst ? 'linh mười' : tram === 0 && chuc === 0 ? ''
                    : chuc === 1 ? 'mười' : this.numericToVietnamese(chuc) + ' mươi') +
                (donvi === 0 ? '' : donvi === 1 && !isLast && !isFirst ? ' mốt' : ' ' + this.numericToVietnamese(donvi)));
    }

    numericToVietnamese(number: number) {
        if (number === 0) {
            return 'không';
        } else if (number === 1) {
            return 'một';
        } else if (number === 2) {
            return 'hai';
        } else if (number === 3) {
            return 'ba';
        } else if (number === 4) {
            return 'bốn';
        } else if (number === 5) {
            return 'năm';
        } else if (number === 6) {
            return 'sáu';
        } else if (number === 7) {
            return 'bảy';
        } else if (number === 8) {
            return 'tám';
        } else if (number === 9) {
            return 'chín';
        }
    }

    formatMoney(n, c, d, t) {
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d === undefined ? '.' : d;
        t = t === undefined ? ',' : t;
        const s = n < 0 ? '-' : '',
            i: any = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
        this.j = (this.j = i.length) > 3 ? this.j % 3 : 0;

        return s + (this.j ? i.substr(0, this.j) + t : '') + i.substr(this.j).replace(/(\d{3})(?=\d)/g, '$1' + t)
            + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    }
}
