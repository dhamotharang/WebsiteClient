/**
 * Created by Administrator on 6/19/2017.
 */
import {Injectable, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';
import {NHTab} from './nh-tab.model';
import * as  _ from 'lodash';

@Injectable()
export class NhTabService {
    tabSelected$ = new Subject();
    // changeShow$ = new Subject();
    tabTitleTemplateRefs: TemplateRef<any>[] = [];
    tabs: NHTab[] = [];

    constructor() {
    }

    selectTab(tabId: any) {
        this.tabSelected$.next(tabId);
        this.tabs.forEach((tab: NHTab) => {
            tab.active = tab.id === tabId;
            tab.show = true;
        });
    }

    addTitleTemplate(templateRef: TemplateRef<any>) {
        this.tabTitleTemplateRefs.push(templateRef);
    }

    addTab(tab: NHTab) {
        const tabInfo = _.find(this.tabs, (nhTab: NHTab) => {
            return nhTab.id === tab.id;
        });
        if (tabInfo) {
            return;
        }
        this.tabs = [...this.tabs, tab];
    }

    changeShow(tabId: string, isShow: boolean) {
        const tabInfo = _.find(this.tabs, (tab: NHTab) => {
            return tab.id === tabId;
        });
        if (tabInfo) {
            tabInfo.show = isShow;
        }
        // this.changeShow$.next({
        //     tabId: tabId,
        //     isShow: isShow
        // });
    }
}
