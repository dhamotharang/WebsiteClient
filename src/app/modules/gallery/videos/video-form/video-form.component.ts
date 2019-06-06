import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Video, VideoType} from '../models/video.model';
import {VideoService} from '../video.service';
import {finalize, map} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VideoDetailViewModel} from '../viewmodels/video-detail.viewmodel';
import * as _ from 'lodash';
import {VideoTranslation} from '../models/video-translation';
import {TagService} from '../../../../shareds/components/nh-tags/tag.service';
import {BaseFormComponent} from '../../../../base-form.component';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {TagType} from '../../../../shareds/components/nh-tags/tag.model';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {UtilService} from '../../../../shareds/services/util.service';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {HttpClient} from '@angular/common/http';
import {ajax} from 'rxjs/internal/observable/dom/ajax';

@Component({
    selector: 'app-video-form',
    templateUrl: './video-form.component.html',
    providers: [VideoService, TagService]
})

export class VideoFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('videoFormModal') videoFormModal: NhModalComponent;
    video = new Video();
    videoLinkId;
    thumbnail;
    videoType;
    albumExist: boolean;
    VideoType = VideoType;
    tagType = TagType;
    listTag = [];
    modelTranslation = new VideoTranslation();
    videoTypes = [{
        id: VideoType.youtube,
        name: 'Youtube'
    }, {
        id: VideoType.vimeo,
        name: 'Vimeo'
    }, {
        id: VideoType.pinterest,
        name: 'Pinterest',
    }, {
        id: VideoType.updateServer,
        name: 'UpdateServer'
    }];
    currentUser;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private http: HttpClient,
                private utilService: UtilService,
                private tagService: TagService,
                private videoService: VideoService) {
        super();
        this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
        this.renderForm();
    }

    onFormModalShown() {
        this.isModified = false;
    }

    add(albumExist: boolean) {
        this.utilService.focusElement('url ' + this.currentLanguage);
        this.isUpdate = false;
        this.videoType = VideoType.youtube;
        this.renderForm();
        this.resetForm();
        this.videoFormModal.open();
    }

    edit(video: Video) {
        this.utilService.focusElement('url ' + this.currentLanguage);
        this.isUpdate = true;
        this.id = video.id;
        this.getDetail(video);
        this.videoFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.validateLanguage();
        if (isValid && isLanguageValid) {
            this.video = this.model.value;
            this.saveSuccessful.emit({
                data: this.video,
                isUpdate: this.isUpdate
            });
            this.resetForm();
            this.videoFormModal.dismiss();
            if (this.isUpdate || !this.isCreateAnother) {
                this.videoFormModal.dismiss();
            } else {
                this.utilService.focusElement('url ' + this.currentLanguage);
            }
            // this.isSaving = true;
            // if (this.isUpdate) {
            //     this.videoService.update(this.video.id, this.video)
            //         .pipe(finalize(() => this.isSaving = false))
            //         .subscribe(() => {
            //             this.isModified = true;
            //             // this.onSaveSuccess.emit();
            //             this.videoFormModal.dismiss();
            //         });
            // } else {
            //     this.videoService.insert(this.video)
            //         .pipe(finalize(() => this.isSaving = false))
            //         .subscribe(() => {
            //             this.isModified = true;
            //             if (this.isCreateAnother) {
            //                 this.resetForm();
            //             } else {
            //                 // this.onSaveSuccess.emit();
            //                 this.videoFormModal.dismiss();
            //             }
            //         });
            // }
        }
    }

    getDetail(videoDetail: Video) {
        if (videoDetail) {
            this.model.patchValue({
                id: videoDetail.id,
                videoLinkId: videoDetail.videoLinkId,
                url: videoDetail.url,
                thumbnail: videoDetail.thumbnail,
                isActive: videoDetail.isActive,
                isHomePage: videoDetail.isHomePage,
                order: videoDetail.order,
                type: videoDetail.type,
                concurrencyStamp: videoDetail.concurrencyStamp,
                albumId: videoDetail.albumId
            });
            this.videoType = videoDetail.type;
            if (videoDetail.translations && videoDetail.translations.length > 0) {
                this.translations.controls.forEach(
                    (model: FormGroup) => {
                        const detail = _.find(
                            videoDetail.translations,
                            (videoTranslations: VideoTranslation) => {
                                return (
                                    videoTranslations.languageId ===
                                    model.value.languageId
                                );
                            }
                        );
                        if (detail) {
                            model.patchValue(detail);
                        }
                    }
                );
            }
        }
    }

    changeInput(e) {
        this.renderVideoId(e.target.value, '', this.model.value.type);
    }

    changeUrl(e) {
        let clipboardData, pastedData;
        e.stopPropagation();
        e.preventDefault();
        clipboardData = e.clipboardData;
        pastedData = clipboardData.getData('Text');

        this.model.patchValue({
            url: pastedData
        });
        this.renderVideoId(pastedData, '', this.model.value.type);
    }

    genderVideo(url: string) {
        this.renderVideoId(url, '', this.model.value.type);
    }

    onSelectThumbnail(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({
                thumbnail: file.absoluteUrl
            });
        } else {
            this.toastr.error('Please select file image');
        }
    }

    private renderVideoId(url: string, size: string, type: number) {
        if (type === VideoType.youtube) {
            this.renderVideoYoutubeId(url, size);
        }
        if (type === VideoType.vimeo) {
            this.renderVideoVimeoId(url);
        }
    }

    private renderVideoYoutubeId(url: string, size: string) {
        if (url) {
            const video_id = url.split('v=')[1];
            if (video_id) {
                const ampersandPosition = video_id.indexOf('&');
                if (ampersandPosition !== -1) {
                    this.videoLinkId = video_id.substring(0, ampersandPosition);
                } else {
                    this.videoLinkId = video_id;
                }
            }

            size = (size === null) ? 'big' : size;
            const results = url.match('[\\?&]v=([^&#]*)');
            const video = (results === null) ? url : results[1];

            if (size === 'small') {
                this.thumbnail = 'http://img.youtube.com/vi/' + video + '/2.jpg';
            } else {
                this.thumbnail = 'http://img.youtube.com/vi/' + video + '/0.jpg';
            }

            this.model.patchValue({
                videoLinkId: this.videoLinkId,
                thumbnail: this.thumbnail
            });
        }
    }

    private renderVideoVimeoId(url) {
        const match = /vimeo.*\/(\d+)/i.exec(url);
        if (match) {
            this.videoLinkId = match[1];
            this.thumbnail = `https://i.vimeocdn.com/video/${this.videoLinkId}.png`;
            this.model.patchValue({
                videoLinkId: this.videoLinkId,
                thumbnail: this.thumbnail
            });
        }
    }

    closeModal() {
        this.videoFormModal.dismiss();
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['url', 'thumbnail', 'type', 'videoLinkId']);
        this.validationMessages = this.renderFormErrorMessage([
            {videoLinkId: ['maxLength']},
            {url: ['required', 'maxLength', 'pattern']},
            {thumbnail: ['maxLength']},
            {type: ['required', 'isValid']}
        ]);

        this.model = this.fb.group({
            id: [this.video.id],
            videoLinkId: [this.video.videoLinkId,
                [Validators.maxLength(100)]],
            url: [this.video.url, [
                Validators.required,
                Validators.maxLength(256),
                Validators.pattern(`(http(s)?://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ;,./?%&=]*)?`)
            ]],
            thumbnail: [this.video.thumbnail, [
                Validators.maxLength(500)
            ]],
            isActive: [this.video.isActive],
            isHomePage: [this.video.isHomePage],
            order: [this.video.order],
            type: [this.video.type, [
                Validators.required
            ]],
            albumId: [this.video.albumId],
            concurrencyStamp: [this.video.concurrencyStamp],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['title', 'description']
        );
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {title: ['required', 'maxLength', 'pattern']},
            {description: ['maxLength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            title: [
                this.modelTranslation.title,
                [Validators.required,
                    Validators.maxLength(256),
                    Validators.pattern(`.*\\S.*`)
                ]
            ],
            description: [this.modelTranslation.description,
                [Validators.maxLength(500)]],
            tags: [this.listTag]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            id: null,
            type: VideoType.youtube,
            url: '',
            thumbnail: '',
            order: 0,
            concurrencyStamp: '',
            isActive: true
        });
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                title: '',
                description: '',
            });
        });
        this.videoLinkId = '';
        this.thumbnail = '';
        this.listTag = [];
        this.videoType = VideoType.youtube;
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }
}

