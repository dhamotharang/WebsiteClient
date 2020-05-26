import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../../base-form.component';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {VideoComponent} from '../../../gallery/videos/video.component';
import {Album, AlbumTranslation} from '../../../gallery/photo/models/album.model';
import {Video} from '../../../gallery/videos/models/video.model';
import {Photo} from '../../../gallery/photo/models/photo.model';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UtilService} from '../../../../shareds/services/util.service';
import * as _ from 'lodash';
import {EventService} from '../../event.service';
import {EventAlbum} from '../event-album.model';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-event-album-form',
    templateUrl: './event-album-form.component.html',
    styleUrls: ['../event-album.component.scss']
})

export class EventAlbumFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('albumFormModal', {static: true}) albumFormModal: NhModalComponent;
    @ViewChild('editPhotoModal', {static: true}) editPhotoModal: NhModalComponent;
    @ViewChild(VideoComponent, {static: true}) videoComponent: VideoComponent;
    albumExist = false;
    eventId;
    album = new Album();
    photo = new Photo();
    translation = new AlbumTranslation();
    photos: Photo[] = [];
    albumTypes: any[] = [];
    videos: Video[] = [];
    title: string;
    description: string;
    currentPhotoId: number;
    eventAlbum = new EventAlbum();

    constructor(private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private utilService: UtilService,
                private spinnerService: SpinnerService,
                private eventService: EventService) {
        super();

        this.albumTypes = [
            {id: 0, name: 'Photo'},
            {id: 1, name: 'Video'}
        ];
    }

    ngOnInit() {
        this.isUpdate = false;
        this.renderForm();
    }

    onModalHidden() {
        this.resetModel();
    }

    add(eventId: string) {
        this.eventId = eventId;
        this.isUpdate = false;
        this.albumFormModal.open();
    }

    edit(eventId: string, albumId: string) {
        this.id = albumId;
        this.eventId = eventId;
        this.isUpdate = true;
        this.getDetail();
        this.albumFormModal.open();
    }

    onThumbnailSelected(explorerItem: ExplorerItem) {
        this.model.patchValue({
            thumbnail: explorerItem.url
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
        this.videoComponent.add(this.albumExist);
    }

    save() {
        const isValid = this.validateModel(true);
        const isLanguageValid = this.validateLanguage();
        if (isValid && isLanguageValid) {
            this.album = this.model.value;
            this.album.photos = this.photos;
            this.album.videos = this.videos;
            this.isSaving = true;
            this.eventAlbum = {
                eventId: this.eventId,
                album: this.album
            };
            if (this.isUpdate) {
                this.eventService.updateAlbum(this.eventId, this.id, this.eventAlbum)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        this.resetModel();
                        this.albumFormModal.dismiss();
                        this.saveSuccessful.emit();
                    });
            } else {
                this.eventService
                    .insertAlbum(this.eventId, this.eventAlbum)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        this.resetModel();
                        if (!this.isCreateAnother) {
                            this.saveSuccessful.emit();
                            this.albumFormModal.dismiss();
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
        this.subscribers.photo = this.eventService.getEventAlbumDetail(this.eventId, this.id)
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
                }
            });
    }

    private resetModel() {
        this.isUpdate = false;
        this.model.patchValue({
            isActive: true,
            isPublic: false,
            concurrencyStamp: '',
            thumbnail: '',
            type: 1,
        });
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                title: '',
                description: '',
                seoLink: '',
                metaTitle: '',
                metaDescription: ''
            });
        });
        this.photos = [];
        this.videos = [];
        this.album = null;
        this.photo = null;
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
            isPublic: [this.album.isPublic],
            concurrencyStamp: [this.album.concurrencyStamp],
            type: [this.album.type, [
                Validators.required
            ]],
            thumbnail: [this.album.thumbnail, [
                Validators.maxLength(500)
            ]],
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
