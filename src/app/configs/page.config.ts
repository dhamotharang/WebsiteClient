import { InjectionToken } from '@angular/core';

export interface IPageConfig {

}

export const PAGE_CONFIG_DI: IPageConfig = {}
export let PAGE_CONFIG = new InjectionToken<IPageConfig>('page.config');
