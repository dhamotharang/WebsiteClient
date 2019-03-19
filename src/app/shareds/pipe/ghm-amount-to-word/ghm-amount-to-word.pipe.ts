import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ghmAmountToWord'
})
export class GhmAmountToWordPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!this.isInfinite(value)) {
            return null;
        } else {
            return this.generateWords(value);
        }
    }

    private isInfinite(value: any) {
        return !(typeof value !== 'number' || value !== value || value === Infinity || value === -Infinity);
    }

    private generateWords(number: number, isNegative = false) {
        // 1. Khởi tạo tham số
        const numberConvert = number.toString();
        const numbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        const currencyTypes = ['', 'nghìn', 'triệu', 'tỷ'];

        let i, j, unit, tens, hundred;
        let result = '';

        // 2. Xử lý
        i = numberConvert.length;
        if (i === 0) {
            result = numbers[0] + result;
        } else {
            j = 0;
            while (i > 0) {
                unit = +numberConvert.substring(i - 1, i);
                i--;
                if (i > 0) {
                    tens = +numberConvert.substring(i - 1, i);
                } else {
                    tens = -1;
                }
                i--;
                if (i > 0) {
                    hundred = +numberConvert.substring(i - 1, i);
                } else {
                    hundred = -1;
                }
                i--;
                if ((unit > 0) || (tens > 0) || (hundred > 0) || (j === 3)) {
                    result = currencyTypes[j] + result;
                }
                j++;
                if (j > 3) {
                    j = 1;
                }
                if ((unit === 1) && (tens === 1)) {
                    result = 'một ' + result;
                } else {
                    if (tens > 0) {
                        result = (
                            unit === 1 ? 'mốt '
                                : unit === 5 ? 'lăm '
                                : unit > 0 ? numbers[unit] + ' ' : ''
                        ) + result;
                    } else {
                        result = (unit > 0 ? numbers[unit] + ' ' : ' ') + result;
                    }
                }
                if (tens >= 0) {
                    if ((tens === 0) && (unit > 0)) {
                        result = 'linh ' + result;
                    } else if (tens === 1) {
                        result = 'mười ' + result;
                    } else if (tens > 1) {
                        result = numbers[tens] + ' mươi ' + result;
                    }
                }
                if (hundred >= 0) {
                    if ((hundred > 0) || (tens > 0) || (unit > 0)) {
                        result = numbers[hundred] + ' trăm ' + result;
                    }
                }
                result = ' ' + result;
            }
        }

        // 3. Kiểm tra
        result = result.trim();
        if (isNegative) {
            result = 'Âm ' + result;
        } else if (result.length > 0) {
            const firstCharacter = result.substring(0, 1);
            const restCharacters = result.substring(1, result.length);
            result = firstCharacter.trim().toUpperCase() + restCharacters;
        }

        // 4. Trả lại chuỗi
        return result + ' đồng.';
    }
}
