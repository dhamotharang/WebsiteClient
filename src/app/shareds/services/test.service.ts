import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TestService {

    constructor(private injector: Injector) { }

    get appSettings() {
        return 1;
    }

    get http() {
        return this.injector.get(HttpClient);
    }

    initApp() {
        return 1;
    }
}
