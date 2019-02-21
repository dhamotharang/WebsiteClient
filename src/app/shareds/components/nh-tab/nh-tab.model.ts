import { Type } from '@angular/core';

/**
 * Created by HoangNH on 6/20/2017.
 */
// export class NHTabTitle {
//     id: string;
//     title: string;
//     active: boolean;
//     url: string;
//     icon: string;
//
//     constructor(id: string, title?: string, active?: boolean, url?: string, icon?: string) {
//         this.id = id;
//         this.title = title;
//         this.active = active == null ? false : active;
//         this.url = url;
//         this.icon = icon;
//     }
// }

export class NHTab {
    id: any;
    title: string;
    active: boolean;
    icon: string;
    // showClose: boolean;
    // distinct: boolean;
    url: string;
    show: boolean;

    constructor(id?: string, title?: string, active?: boolean, icon?: string, url?: string, show?: boolean) {
        this.id = id == null || id === undefined ? this.getTabId() : id;
        this.title = title;
        this.active = active;
        this.icon = icon;
        // this.showClose = showClose;
        // this.distinct = distinct == null || distinct === undefined ? false : distinct;
        this.url = url;
        this.show = show;
    }

    private getTabId(): string {
        return 'nh-tabs-' + Math.round(new Date().getTime() + (Math.random() * 100));
    }
}
