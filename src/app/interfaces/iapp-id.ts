/**
 * Created by HoangNH on 12/22/2016.
 */
import { InjectionToken } from '@angular/core';

export interface IAppId {
    config: number;
    hr: number;
    training: number;
    website: number;
    task: number;
    mail: number;
    appPregnancy: number;
    crm: number;
    switchboard: number;
}

// Injection Tokens
export let APP_ID = new InjectionToken<IAppId>('app-id.config')
