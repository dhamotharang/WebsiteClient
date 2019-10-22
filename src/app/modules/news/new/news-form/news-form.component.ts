import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {finalize} from 'rxjs/operators';
import {CategoryService} from '../../category/category.service';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {BaseFormComponent} from '../../../../base-form.component';
import {News, NewsStatus} from '../model/news.model';
import {UtilService} from '../../../../shareds/services/util.service';
import {NewsService} from '../service/news.service';
import {TreeData} from '../../../../view-model/tree-data';
import {NewsTranslation} from '../model/news-translations.model';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {TagType} from '../../../../shareds/components/nh-tags/tag.model';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {NewDetailViewModel} from '../viewmodel/new-detail.viewmodel';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ToastrService} from 'ngx-toastr';
import {TinymceComponent} from '../../../../shareds/components/tinymce/tinymce.component';
import {CategoryNewsViewModel} from '../viewmodel/categoryNewsViewModel';
import {environment} from '../../../../../environments/environment';

declare var tinyMCE;

@Component({
    selector: 'app-news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['../news.scss'],
    providers: [CategoryService, NewsService]
})

export class NewsFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('newsFormModal') newsFormModal: NhModalComponent;
    @ViewChildren(TinymceComponent) eventContentEditors: QueryList<TinymceComponent>;
    @Output() onSaveSuccess = new EventEmitter();
    news = new News();
    listTag = [];
    tagType = TagType;
    categoryTree;
    newDetail: NewDetailViewModel;
    categoryNews: number[];
    modelTranslation = new NewsTranslation();
    newsStatus = NewsStatus;
    categoryText;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private cdr: ChangeDetectorRef,
                private utilService: UtilService,
                private categoryService: CategoryService,
                private toastr: ToastrService,
                private newsService: NewsService) {
        super();
        // this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.NEWS, this.pageId.NEWS_LIST, 'Quản lý tin tức', 'Danh sách tin tức');
        this.renderForm();
        this.getCategoryTree();
        this.subscribers.routerParam = this.route.params.subscribe((params: any) => {
            const id = params['id'];
            if (id) {
                this.id = id;
                this.isUpdate = true;
                this.newsService.getDetail(id).subscribe((result: ActionResultViewModel<NewDetailViewModel>) => {
                    this.newDetail = result.data;
                    if (this.newDetail) {
                        if (this.newDetail.categoriesNews) {
                            this.categoryNews = [];
                            const listCategoryByLanguageId = _.filter(this.newDetail.categoriesNews, (category: CategoryNewsViewModel) => {
                                return category.languageId === this.currentLanguage;
                            });

                            _.each(listCategoryByLanguageId, (category: any) => {
                                this.categoryNews.push(category.categoryId);
                            });

                            this.categoryText = _.join(_.map(listCategoryByLanguageId, (categoryNews: CategoryNewsViewModel) => {
                                return categoryNews.categoryName;
                            }), ', ');
                        }
                        this.model.patchValue({
                            id: this.newDetail.id,
                            categoriesNews: this.categoryNews,
                            altImage: this.newDetail.altImage,
                            bannerImage: this.newDetail.bannerImage,
                            isHot: this.newDetail.isHot,
                            isHomePage: this.newDetail.isHomePage,
                            source: this.newDetail.source,
                            isActive: this.newDetail.isActive,
                            featureImage: this.newDetail.featureImage,
                            concurrencyStamp: this.newDetail.concurrencyStamp,
                        });
                    }

                    if (this.newDetail.newsTranslations && this.newDetail.newsTranslations.length > 0) {
                        this.modelTranslations.controls.forEach(
                            (model: FormGroup) => {
                                const detail = _.find(
                                    this.newDetail.newsTranslations,
                                    (newTranslation: NewsTranslation) => {
                                        return (
                                            newTranslation.languageId === model.value.languageId
                                        );
                                    }
                                );
                                detail.content = detail.content.replace(new RegExp('"uploads/', 'g'), '"' + environment.fileUrl + 'uploads/');
                                if (detail) {
                                    model.patchValue(detail);

                                    this.eventContentEditors.forEach((contentEditor: TinymceComponent) => {
                                        const editorId = `newsContent${this.currentLanguage}`;
                                        if (contentEditor.elementId === editorId) {
                                            contentEditor.setContent(detail.content);
                                        }
                                    });

                                }
                            }
                        );
                    }
                });

            }
        });
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
        this.initEditor();
        this.utilService.focusElement('title ' + this.currentLanguage);
    }

    onAcceptSelectCategory(data: TreeData[]) {
        this.categoryNews = [];
        if (data && data.length > 0) {
            _.each(data, (tree: TreeData) => {
                this.categoryNews.push(parseInt(tree.id));
            });
        }
        this.model.patchValue({categoriesNews: this.categoryNews});
    }

    save(isSend: boolean) {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.news = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.newsService.update(this.id, this.news, isSend)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.router.navigate(['/news']);
                    });
            } else {
                this.newsService.insert(isSend, this.news)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('title ' + this.currentLanguage);
                            this.resetForm();
                        } else {
                            this.router.navigate(['/news']);
                        }
                    });
            }
        }
    }

    removeTag(value) {
    }

    selectTag(value) {
    }

    selectListTag(value) {
        if (value) {
            this.listTag = value;
        }
    }

    afterUploadImage(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({featureImage: file.absoluteUrl});
        } else {
            this.toastr.error('Please select file image');
        }
    }

    removeFeatureImage(item: any) {
        this.model.patchValue({featureImage: ''});
    }

    removeBannerImage(item: any) {
        this.model.patchValue({bannerImage: ''});
    }

    afterUploadImageBanner(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({bannerImage: file.absoluteUrl});
        } else {
            this.toastr.error('Please select file image');
        }
    }

    afterDeleteImage() {
        this.model.patchValue({altImage: ''});
    }

    afterUploadImageContent(images: ExplorerItem[], i: number) {
        const id = 'content' + i;
        images.forEach((image) => {
            if (image.isImage) {
                const imageAbsoluteUrl = environment.fileUrl + image.url;
                tinyMCE.execCommand('mceInsertContent', false,
                    `<img class="img-responsive lazy" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}"/>`);
            }
        });
        // let content = tinyMCE.get(id).getContent();
        // content = content.replace('"uploads/', '"' + environment.fileUrl + 'uploads/');
        // tinyMCE.get(id).setContent(content);
    }

    selectImage(image: ExplorerItem) {
        if (image.isImage) {
            const imageAbsoluteUrl = environment.fileUrl + image.url;
            tinyMCE.execCommand('mceInsertContent', false,
                `<img class="img-responsive lazy" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}"/>`);
        }
    }

    closeForm() {
        this.router.navigate(['/news']);
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['featureImage', 'bannerImage', 'source', 'categoriesNews', 'altImage']);
        this.validationMessages = this.renderFormErrorMessage([
            {'featureImage': ['maxLength']},
            {'bannerImage': ['maxLength']},
            {'altImage': ['maxLength']},
            {'categoriesNews': ['required']},
            {'source': ['maxLength']}]);
        this.model = this.fb.group({
            id: [this.news.id],
            categoriesNews: [this.news.categoriesNews, [
                Validators.required
            ]],
            isActive: [this.news.isActive],
            altImage: [this.news.altImage, [
                Validators.maxLength(258)
            ]],
            isHot: [this.news.isHot],
            isHomePage: [this.news.isHomePage],
            source: [this.news.source, [
                Validators.maxLength(256)
            ]],
            featureImage: [this.news.featureImage, [Validators.maxLength(500)]],
            bannerImage: [this.news.bannerImage, [Validators.maxLength(500)]],
            concurrencyStamp: [this.news.concurrencyStamp],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['title', 'description', 'content', 'metaTitle', 'metaDescription', 'metaKeyword']
        );
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {title: ['required', 'maxLength']},
            {description: ['maxLength']},
            {content: ['required']},
            {metaTitle: ['maxLength']},
            {metaDescription: ['maxLength']},
            {metaKeyword: ['maxLength']},
            {seoLink: ['maxLength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            title: [
                this.modelTranslation.title,
                [Validators.required, Validators.maxLength(256)]
            ],
            description: [this.modelTranslation.description,
                [Validators.maxLength(1000)]],
            content: [
                this.modelTranslation.content,
                [Validators.required]
            ],
            metaTitle: [this.modelTranslation.metaTitle,
                [Validators.maxLength(256)]],
            metaDescription: [
                this.modelTranslation.metaDescription,
                [Validators.maxLength(1000)]
            ],
            seoLink: [this.modelTranslation.seoLink, [Validators.maxLength(256)]],
            metaKeyword: [this.modelTranslation.metaKeyword,
                [Validators.maxLength(300)]],
            tags: [this.listTag]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            id: null,
            categoriesNews: [],
            altImage: '',
            isHot: false,
            isHomePage: false,
            source: '',
            isActive: true,
            featureImage: '',
            bannerImage: '',
            concurrencyStamp: '',
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                title: '',
                description: '',
                content: '',
                metaTitle: '',
                metaDescription: '',
                metaKeyword: '',
                seoLink: ''
            });
        });
        this.listTag = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private getCategoryTree() {
        this.categoryService.getTree().subscribe((result: TreeData[]) => {
            this.categoryTree = result;
        });
    }

    private initEditor() {
        this.eventContentEditors.forEach((eventContentEditor: TinymceComponent) => {
            eventContentEditor.destroy();
            eventContentEditor.initEditor();
        });
    }
}

