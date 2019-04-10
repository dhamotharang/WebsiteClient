import { Observable, Subscriber } from 'rxjs';
import {ComponentFactoryResolver, OnDestroy, Type, ViewContainerRef} from '@angular/core';
import { AppInjector } from './shareds/helpers/app-injector';
import { AppService } from './shareds/services/app.service';
import { BriefUser } from './shareds/models/brief-user.viewmodel';
import { PermissionViewModel } from './shareds/view-models/permission.viewmodel';
import {APP_CONFIG, IAppConfig} from './configs/app.config';
import {IPageId, PAGE_ID} from './configs/page-id.config';

export class BaseListComponent<TEntity> implements OnDestroy {
    currentUser: BriefUser;
    appService: AppService;
    keyword: string;
    currentPage = 1;
    pageSize = 10;
    totalRows = 0;
    totalRows$: Observable<number>;
    isSearching = false;
    listItems: TEntity[] = [];
    listItems$: Observable<TEntity[]>;
    subscribers: any = {};
    // Permission.
    permission: PermissionViewModel = {
        view: false,
        add: false,
        edit: false,
        delete: false,
        export: false,
        print: false,
        approve: false,
        report: false
    };

    constructor() {
        this.appService = AppInjector.get(AppService);
        setTimeout(() => {
            this.permission = this.appService.getPermissionByPageId();
            console.log(this.permission);
        });
    }

    ngOnDestroy() {
        for (const subscriberKey in this.subscribers) {
            if (this.subscribers.hasOwnProperty(subscriberKey)) {
                const subscriber = this.subscribers[subscriberKey];
                if (subscriber instanceof Subscriber) {
                    subscriber.unsubscribe();
                }
            }
        }
    }

    // getPermission(appService: AppService, pageId: number) {
    //     this.permission.view = appService.checkPermission(pageId, Permission.view);
    //     this.permission.add = appService.checkPermission(pageId, Permission.insert);
    //     this.permission.edit = appService.checkPermission(pageId, Permission.update);
    //     this.permission.delete = appService.checkPermission(pageId, Permission.delete);
    //     this.permission.export = appService.checkPermission(pageId, Permission.export);
    //     this.permission.print = appService.checkPermission(pageId, Permission.print);
    //     this.permission.approve = appService.checkPermission(pageId, Permission.approve);
    //     this.permission.report = appService.checkPermission(pageId, Permission.report);
    // }
    loadComponent<T>(viewContainerRef: ViewContainerRef,
                    component: Type<T>) {
        const {injector} = viewContainerRef;
        const componentFactoryResolver = injector.get(ComponentFactoryResolver);
        const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        return (<T>componentRef.instance);
    }
}
