import {AfterViewInit, Component, Inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {BaseFormComponent} from '../../../../base-form.component';
import {WebsiteService} from '../service/website.service';
import {WebsiteInfo} from '../model/website-info.model';
import {FormBuilder} from '@angular/forms';
import {WebsiteInfoTranslation} from '../model/website-info.translation';
import {UtilService} from '../../../../shareds/services/util.service';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ToastrService} from 'ngx-toastr';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {SettingViewModel} from '../view-models/setting.viewmodel';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {finalize} from 'rxjs/operators';
import {TinymceComponent} from '../../../../shareds/components/tinymce/tinymce.component';

@Component({
    selector: 'app-config-website-info',
    templateUrl: './website-info.component.html',
})

export class WebsiteInfoComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChildren(TinymceComponent) eventContentEditors: QueryList<TinymceComponent>;
    websiteInfo = new WebsiteInfo();
    modelTranslation = new WebsiteInfoTranslation();
    settings: SettingViewModel[] = [];
    currentSetting: SettingViewModel;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private websiteService: WebsiteService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
        this.websiteService.getWebsiteSetting(this.currentLanguage)
            .subscribe((result: SettingViewModel[]) => {
                this.settings = result;
            });
    }

    ngAfterViewInit() {
        this.initEditor();
    }

    save() {
        this.websiteInfo = this.model.value;
        this.isSaving = true;
        this.websiteService.save(this.settings)
            .pipe(finalize(() => this.isSaving = false))
            .subscribe((result: ActionResultViewModel) => {
            });
    }

    selectLanguage(value) {
        this.currentLanguage = value.id;
        this.websiteService.getWebsiteSetting(this.currentLanguage)
            .subscribe((result: SettingViewModel[]) => {
                this.settings = result;
                this.initEditor();
            });
    }

    onImageSelected(file: ExplorerItem, setting: SettingViewModel) {
        if (file.isImage) {
            setting.value = file.absoluteUrl;
        } else {
            this.toastr.error('Please select file image');
        }
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.model = this.fb.group({
            logo: [this.websiteInfo.logo],
            favicon: [this.websiteInfo.favicon],
            ip: [this.websiteInfo.ip],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private buildFormLanguage = (language: string) => {
        const translationModel = this.fb.group({
            languageId: [language],
            brand: [this.modelTranslation.brand],
            instruction: [this.modelTranslation.instruction],
            metaTitle: [this.modelTranslation.metaTitle],
            metaDescription: [this.modelTranslation.metaDescription],
            metaKeyword: [this.modelTranslation.metaKeyword],
            description: [this.modelTranslation.description],
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    };

    private initEditor() {
        this.eventContentEditors.forEach((eventContentEditor: TinymceComponent) => {
            eventContentEditor.initEditor();
        });
    }
}
