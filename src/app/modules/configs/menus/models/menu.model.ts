
import {Positions} from '../../../../shareds/constants/position.const';

export class Menu {
    name: string;
    description: string;
    icon: string;
    effectType: number;
    isActive: boolean;
    position: number;
    concurrencyStamp: string;

    constructor() {
        this.isActive = true;
        this.position = Positions.top;
    }
}
