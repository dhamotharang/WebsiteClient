import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../../base-list.component';
import {LanguageService} from './service/language.service';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {LanguageFormComponent} from './language-form/language-form.component';
import {LanguageSearchViewModel} from './viewmodel/language-search.viewmodel';
import * as _ from 'lodash';

@Component({
    selector: 'app-config-language',
    templateUrl: './language.component.html',
    providers: [LanguageService]
})

export class LanguageComponent extends BaseListComponent<LanguageSearchViewModel> implements OnInit {
    @ViewChild(LanguageFormComponent, {static: true}) languageFormComponent: LanguageFormComponent;
    isShowForm;
    listLanguage;

    constructor(private languageService: LanguageService) {
        super();
    }

    ngOnInit() {
    }

    search() {
        this.languageService.search()
            .subscribe((result: SearchResultViewModel<LanguageSearchViewModel>) => {
                this.listLanguage = result.items;
            });
    }

    updateStatus(language: LanguageSearchViewModel, isActive: boolean) {
        this.languageService.updateStatus(language.languageId, !isActive).subscribe(() => {
            language.isActive = !isActive;
        });
    }

    updateDefault(language: LanguageSearchViewModel, isDefault: boolean) {
        this.languageService.updateDefault(language.languageId, !isDefault).subscribe(() => {
            language.isDefault = !isDefault;
        });
    }

    delete(languageId: string) {
        this.languageService.delete(languageId).subscribe(() => {
            _.remove(this.listLanguage, (item: LanguageSearchViewModel) => {
                return item.languageId === languageId;
            });
        });
    }
}
