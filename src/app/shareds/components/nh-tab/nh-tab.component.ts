/**
 * Created by Administrator on 6/18/2017.
 */
import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {NhTabPaneComponent} from './nh-tab-pane.component';
import {Title} from '@angular/platform-browser';
import {NhTabService} from './nh-tab.service';
import {NHTab} from './nh-tab.model';
import {NhTabTitleComponent} from './nh-tab-title.component';
import * as _ from 'lodash';

@Component({
    selector: 'nh-tab',
    template: `
        <ul class="nh-tab-title-container" #nhTabTitleContainer>
            <ng-container *ngIf="dynamicTabTitle; else staticTabTitleTemplate">
                <li class="nh-tab-title"
                    *ngFor="let tab of tabs"
                    [class.active]="tab.active"
                    (click)="selectTab(tab)"
                    [attr.title]="tab.title"
                    [class.hidden]="!tab.show">
                    <i class="nh-tab-title-icon" [ngClass]="tab.icon" *ngIf="tab.icon"></i>
                    <span class="nh-tab-title-content">{{tab.title}}</span>
                    <!--<i class="fa fa-times btn-close-tab" *ngIf="tab.showClose" (click)="closeTab(tab)"></i>-->
                </li>
            </ng-container>
            <ng-template #staticTabTitleTemplate>
                <li class="nh-tab-title"
                    *ngFor="let tab of tabs"
                    [class.active]="tab.active"
                    (click)="selectTab(tab)"
                    [attr.title]="tab.title"
                    [class.hidden]="!tab.show">
                    <span class="nh-tab-title-content">
                        <ng-container #nhTabTitle></ng-container>
                    </span>
                </li>
            </ng-template>
        </ul>
        <div class="nh-tab-content">
            <ng-content></ng-content>
            <nh-tab-pane *ngFor="let tabItem of listTabDynamic"
                         [id]="tabItem.id"
                         [active]="tabItem.active"
                         [url]="tabItem.url"
                         [title]="tabItem.title"
                         [icon]="tabItem.icon"
                         [showClose]="tabItem.showClose"
                         [class.active]="tabItem.active == true"
            ></nh-tab-pane>
        </div>
    `,
    styleUrls: ['./nh-tab.component.scss'],
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        NhTabService
    ],
    encapsulation: ViewEncapsulation.None
})

export class NhTabComponent implements OnInit, AfterViewInit, AfterContentInit {
    @ViewChildren(NhTabTitleComponent) nhTabTitleComponents: QueryList<NhTabTitleComponent>;
    @ContentChildren(NhTabPaneComponent) nhTabPanelComponents: QueryList<NhTabPaneComponent>;
    @ViewChildren('nhTabTitle', {read: ViewContainerRef}) nhTabTitleContainerRefs: QueryList<ViewContainerRef>;
    @ViewChildren(NhTabPaneComponent) nhTabPanelComponentsDynamic: QueryList<NhTabPaneComponent>;
    @ViewChild('nhTabTitleContainer') nhTabTitleContainer: ElementRef;
    @ViewChild('titleContainer', {read: ViewContainerRef}) titleContainer: ViewContainerRef;
    @Output() onCloseTab = new EventEmitter();
    @Output() tabSelected = new EventEmitter();
    listTabDynamic = [];
    dynamicTabTitle = false;

    constructor(private location: Location,
                private title: Title,
                private tabService: NhTabService) {
    }

    get tabs() {
        return this.tabService.tabs;
    }

    ngOnInit() {
        this.tabService.tabSelected$.subscribe(tabId => {
            this.tabSelected.emit(tabId);
        });
    }

    ngAfterContentInit() {
        this.dynamicTabTitle = this.tabService.tabTitleTemplateRefs.length === 0;
        this.nhTabPanelComponents.map((nhTabPanelComponent: NhTabPaneComponent, index: number) => {
            const tabComponentId = nhTabPanelComponent.id ? nhTabPanelComponent.id : (new Date().getTime() + index).toString();
            nhTabPanelComponent.id = tabComponentId;
            this.tabService.addTab(new NHTab(tabComponentId, nhTabPanelComponent.title,
                nhTabPanelComponent.active, nhTabPanelComponent.url, nhTabPanelComponent.icon, nhTabPanelComponent.show));
        });
    }

    ngAfterViewInit() {
        this.setTabTitleContent();
    }

    // addTab(tabItem: NHTab) {
    //     this.title.setTitle(tabItem.title);
    //     if (tabItem.distinct) {
    //         // Kiểm tra xem tab đã tồn tại chưa.
    //         const tabInfo = _.find(this.listTabDynamic, (tab: NHTab) => {
    //             return tabItem.id === tab.id;
    //         });
    //
    //         if (tabInfo) {
    //             this.setTabActive(tabInfo);
    //         } else {
    //             this.appendTab(tabItem);
    //         }
    //     } else {
    //         this.appendTab(tabItem);
    //     }
    // }

    selectTab(tab: NHTab) {
        if (tab.title) {
            this.title.setTitle(tab.title);
        }
        // this.tabService.selectTab(tab.id);
        // Update lại trạng thái active của tab về false
        this.tabs.forEach((tabTitle: NHTab) => {
            tabTitle.active = tabTitle.id === tab.id;
        });
        // Update tab panel active.
        this.nhTabPanelComponents.forEach((nhTabPanel: NhTabPaneComponent) => {
            const tabInfo = _.find(this.tabs, (tabItem: NHTab) => {
                return tabItem.id === tab.id;
            });
            if (nhTabPanel.id === tab.id) {
                nhTabPanel.tabSelected.emit(tabInfo);
            }
            nhTabPanel.active = nhTabPanel.id === tab.id;
            // nhTabPanel.tabSelected.emit(tabInfo);
        });
    }

    showTab(tabId: string) {
        this.tabService.changeShow(tabId, true);
    }

    // closeTab(tabItem: NHTab) {
    //     this.onCloseTab.emit({id: tabItem.id, active: tabItem.active});
    //     _.remove(this.tabTitles, (tabTitle: NHTabTitle) => {
    //         return tabTitle.id === tabItem.id;
    //     });
    //     _.remove(this.listTabDynamic, (tabPanel: NHTab) => {
    //         return tabPanel.id === tabItem.id;
    //     });
    //
    //     // Nếu đóng tab đang active -> active vào tab cuối cùng.
    //     if (tabItem.active) {
    //         const lastTabItem = this.listTabDynamic[this.listTabDynamic.length - 1];
    //         if (lastTabItem) {
    //             this.setTabActive(lastTabItem);
    //         }
    //     }
    // }

    // closeTabByTabId(tabId: string) {
    //     const tabInfo = _.find(this.listTabDynamic, (tabItem: NHTab) => {
    //         return tabItem.id === tabId;
    //     });
    //     if (tabInfo) {
    //         this.closeTab(tabInfo);
    //     }
    // }

    setTabActiveById(tabId: string) {
        this.tabService.selectTab(tabId);
    }

    // private setTabActive(tab: NHTab) {
    //     this.tabTitles.forEach((tabItem: NHTab) => {
    //         tabItem.active = tabItem.id === tab.id;
    //     });
    //     this.tabService.selectTab(tab.id);
    // }

    // private appendTab(tabItem: NHTab) {
    //     this.tabTitles = [...this.tabTitles, tabItem];
    //     this.listTabDynamic = [...this.listTabDynamic, tabItem];
    //     setTimeout(() => {
    //         const insertedTab = this.nhTabPanelComponentsDynamic.last;
    //         const componentInstance = insertedTab.loadComponent(tabItem.component);
    //
    //         // Gọi lại callback sau khi thêm tab mới thành công.
    //         if (typeof tabItem.callback === 'function') {
    //             tabItem.callback(componentInstance);
    //         }
    //
    //         // Thay đổi trạng thái active vào tab mới được chọn.
    //         if (tabItem.active) {
    //             this.setTabActive(tabItem);
    //         }
    //     }, 100);
    // }

    private setTabTitleContent() {
        if (this.tabService.tabTitleTemplateRefs.length > 0) {
            this.nhTabTitleContainerRefs.map((viewContainerRef: ViewContainerRef, index: number) => {
                viewContainerRef.createEmbeddedView(this.tabService.tabTitleTemplateRefs[index]);
            });
        }
    }
}
