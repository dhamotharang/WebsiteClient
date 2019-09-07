import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NhSuggestionComponent } from './nh-suggestion.component';
import * as _ from 'lodash';

@Injectable()
export class NhSuggestionService {
    private suggestions: NhSuggestionComponent[] = [];

    constructor(private http: HttpClient) {
    }

    search(url: string, keyword: string): Observable<any> {
        return this.http.get(url, {
            params: new HttpParams().set('keyword', keyword)
        });
    }

    add(suggestion: NhSuggestionComponent) {
        const count = _.countBy(this.suggestions, (suggestionItem: NhSuggestionComponent) => {
            return suggestionItem.id === suggestion.id;
        }).true;
        if (!count || count === 0) {
            this.suggestions = [...this.suggestions, suggestion];
        }
    }

    setActive(suggestion: NhSuggestionComponent, isActive: boolean) {
        this.suggestions.forEach((suggestionItem: NhSuggestionComponent) => {
            if (suggestion.id === suggestionItem.id) {
                suggestionItem.isActive = isActive;
            }
        });
    }
}
