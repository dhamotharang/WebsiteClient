import {PreloadingStrategy, Route} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class CustomPreloadingStrategyService implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        return route.data && route.data.preload ? load() : of(null);
    }
}
