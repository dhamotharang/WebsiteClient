import { Injector } from '@angular/core';

export let AppInjector: Injector;

export function setAppInjector(injector: Injector) {
    if (AppInjector) {
        console.warn('App injector already set');
    } else {
        AppInjector = injector;
    }
}
