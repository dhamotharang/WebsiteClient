import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PhotoService} from '../photo.service';
import {BaseFormComponent} from '../../../../base-form.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {Album, AlbumTranslation} from '../models/album.model';
import {Photo} from '../models/photo.model';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import * as _ from 'lodash';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {Video} from '../../videos/models/video.model';
import {VideoComponent} from '../../videos/video.component';

@Component({
    selector: 'app-album-form',
    templateUrl: './album-form.component.html',
    styleUrls: ['../album.component.scss']
})
export class AlbumFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('editPhotoModal') editPhotoModal: NhModalComponent;
    @ViewChild(VideoComponent) videoComponent: VideoComponent;
    album = new Album();
    photo = new Photo();
    translation = new AlbumTranslation();
    photos: Photo[] = [];
    albumTypes: any[] = [];
    videos: Video[] = [];
    title: string;
    description: string;
    currentPhotoId: number;

    constructor(private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private utilService: UtilService,
                private spinnerService: SpinnerService,
                private photoService: PhotoService) {
        super();
        this.subscribers.params = this.route.params.subscribe(params => {
            const id = params.id;
            if (id) {
                this.id = id;
                this.isUpdate = true;
                this.getDetail();
            }
        });
        this.albumTypes = [
            {id: 0, name: 'Photo'},
            {id: 1, name: 'Video'}
        ];
    }

    ngOnInit() {
        this.renderForm();
    }

    onThumbnailSelected(explorerItem: ExplorerItem) {
        this.model.patchValue({
            thumbnail: explorerItem.url
        });
    }

    removeThumbnail() {
        this.model.patchValue({
            thumbnail: ''
        });
    }

    onAcceptSelectPhotos(explorerItems: ExplorerItem[]) {
        explorerItems.map((explorerItem: ExplorerItem) => {
            this.photos.push(new Photo(explorerItem.absoluteUrl));
        });
    }

    onEditPhotoModalShown() {
        this.utilService.focusElement('title');
    }

    addVideo() {
        this.videoComponent.add();
    }

    save() {
        const isValid = this.validateModel(true);
        const isLanguageValid = this.validateLanguage();
        if (isValid && isLanguageValid) {
            this.album = this.model.value;
            this.album.photos = this.photos;
            this.album.videos = this.videos;
            this.isSaving = true;
            if (this.isUpdate) {
                this.photoService.update(this.id, this.album)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.album.concurrencyStamp = result.data;
                        this.toastr.success(result.message);
                        this.isModified = true;
                        this.resetModel();
                        this.router.navigateByUrl('/gallery/album');
                    });
            } else {
                this.photoService
                    .insert(this.album)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.resetModel();
                        if (!this.isCreateAnother) {
                            this.router.navigateByUrl('/gallery/album');
                        }
                    });
            }
        }
    }

    editPhoto(photo: Photo) {
        this.currentPhotoId = this.photos.indexOf(photo);
        this.title = photo.title;
        this.description = photo.description;
        this.editPhotoModal.open();
    }

    removePhoto(photo: Photo) {
        _.remove(this.photos, photo);
    }

    saveDescription() {
        const photo = this.photos[this.currentPhotoId];
        if (photo) {
            photo.title = _.cloneDeep(this.title);
            photo.description = _.cloneDeep(this.description);
            this.description = '';
            this.title = '';
            this.currentPhotoId = null;
            this.editPhotoModal.dismiss();
        }
    }

    private getDetail() {
        this.subscribers.photo = this.photoService.getDetail(this.id)
            .subscribe((albumDetail: Album) => {
                if (albumDetail) {
                    this.model.patchValue({
                        isActive: albumDetail.isActive,
                        thumbnail: albumDetail.thumbnail,
                        type: albumDetail.type,
                        concurrencyStamp: albumDetail.concurrencyStamp,
                    });

                    if (albumDetail.translations && albumDetail.translations.length > 0) {
                        this.translations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(albumDetail.translations, (translation: AlbumTranslation) => {
                                return translation.languageId === model.value.languageId;
                            });
                            if (detail) {
                                model.patchValue(detail);
                            }
                        });
                    }
                    this.photos = albumDetail.photos;
                    this.videos = albumDetail.videos;
                    console.log(albumDetail.videos);
                }
            });
    }

    private resetModel() {
        this.isUpdate = false;
        this.model.patchValue({
            isActive: true,
            concurrencyStamp: ''
        });
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                title: '',
                description: ''
            });
        });
        this.photos = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['type', 'thumbnail']);
        this.validationMessages = this.renderFormErrorMessage([
            {'type': ['required']},
            {'thumbnail': ['maxlength']},
        ]);
        this.model = this.fb.group({
            isActive: [this.album.isActive],
            concurrencyStamp: [this.album.concurrencyStamp],
            type: [this.album.type, [
                Validators.required
            ]],
            thumbnail: [this.album.thumbnail, [
                Validators.maxLength(500)
            ]],
            isPublic: [this.album.isPublic],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.validateModel(false));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.renderFormError(['title', 'description']);
        this.translationValidationMessage[language] = this.renderFormErrorMessage([
            {'title': ['required', 'maxlength', 'pattern']},
            {'description': ['maxlength']},
            {'seoLink': ['maxlength']},
            {'metaTitle': ['maxlength']},
            {'metaDescription': ['maxlength']},
        ]);
        const pageTranslationModel = this.fb.group({
            languageId: [language],
            title: [this.translation.title, [
                Validators.required,
                Validators.maxLength(256),
                Validators.pattern(`.*\\S.*`)
            ]],
            description: [this.translation.description, [
                Validators.maxLength(500)
            ]],
            seoLink: [this.translation.seoLink, [
                Validators.maxLength(500)
            ]],
            metaTitle: [this.translation.metaTitle, [
                Validators.maxLength(256)
            ]],
            metaDescription: [this.translation.metaDescription, [
                Validators.maxLength(500)
            ]],
        });
        pageTranslationModel.valueChanges.subscribe((data: any) => this.validateTranslation(false));
        return pageTranslationModel;
    };
}
