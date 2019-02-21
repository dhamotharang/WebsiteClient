import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { NewsService } from '../news.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { News } from '../news.model';
import { IResponseResult } from '../../../../interfaces/iresponse-result';
import { ToastrService } from 'ngx-toastr';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { ActivatedRoute } from '@angular/router';
import { TinymceComponent } from '../../../../shareds/components/tinymce/tinymce.component';
import { CategoryService } from '../../category/category.service';
import { TreeData } from '../../../../view-model/tree-data';
import { Category } from '../../category/category.model';
import * as _ from 'lodash';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-news-form',
    templateUrl: './news-form.component.html',
    providers: [CategoryService]
})

export class NewsFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('newsFormModal') newsFormModal: NhModalComponent;
    @ViewChild('newsContentEditor') newsContentEditor: TinymceComponent;
    @Output() onSaveSuccess = new EventEmitter();
    news = new News();
    categoryTree = [];

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private utilService: UtilService,
                private spinnerService: SpinnerService,
                private categoryService: CategoryService,
                private newsService: NewsService) {
        super();
    }

    ngOnInit() {
        this.buildForm();
        this.getCategoryTree();
    }

    onNewsFormModalShown() {
        if (this.newsContentEditor) {
            this.newsContentEditor.initEditor();
        }

        this.utilService.focusElement('courseName');
        this.newsContentEditor.initEditor();
    }

    onNewsFormModalHidden() {
        if (this.isModified) {
            this.onSaveSuccess.emit();
        }
        this.newsContentEditor.destroy();
    }

    onAcceptSelectCategory(data: TreeData[]) {
        this.model.patchValue({categoryIds: _.map(data, 'id')});
    }

    add() {
        this.isUpdate = false;
        this.newsFormModal.open();
    }

    edit(news: News) {
        this.isUpdate = true;
        this.newsFormModal.open();
        this.spinnerService.show('Đang tải thông tin tin tức. Vui lòng đợi...');
        this.newsService.getDetail(news.id)
            .subscribe((result: News) => {
                this.model.patchValue(result);
                this.newsContentEditor.setContent(result.content);
            });
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.news = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.newsService.update(this.news)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        this.newsFormModal.dismiss();
                    });
            } else {
                this.newsService.insert(this.news)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.toastr.success(result.message);
                        this.model.reset(new News());
                        this.isModified = true;
                    });
            }
        }
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['title', 'description', 'content', 'image', 'source', 'categoryIds']);
        this.validationMessages = {
            'title': {
                'required': 'Vui lòng nhập tiêu đề tin.',
                'maxLength': 'Tiêu đề không được phép lớn hơn 256 ký tự'
            },
            'description': {
                'required': 'Vui lòng nhập nội dung mô tả',
                'maxLength': 'Nội dung mô tả không được phép lớn hơn 500 ký tự.'
            },
            'content': {
                'required': 'Vui lòng nhập nội dung tin tức.'
            },
            'image': {
                'required': 'Vui lòng chọn ảnh đại diện.'
            },
            'source': {
                'maxLength': 'Nguồn bài viết không được phép lớn hơn 500 ký tự.'
            },
            'categoryIds': {
                'required': 'Vui lòng chọn ít nhất một chuyên mục.'
            }
        };
        this.model = this.fb.group({
            'id': [this.news.id],
            'title': [this.news.title, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            'description': [this.news.description, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            'content': [this.news.content, [
                Validators.required
            ]],
            'categoryIds': [this.news.categoryIds, [
                Validators.required
            ]],
            'isActive': [this.news.isActive],
            'image': [this.news.image, [
                Validators.required
            ]],
            'isHot': [this.news.isHot],
            'isHomePage': [this.news.isHomePage],
            'source': [this.news.source, [
                Validators.maxLength(500)
            ]]
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private getCategoryTree() {
        this.subscribers.getCategoryTree = this.categoryService.getCategoryTree()
            .subscribe((result: Category[]) => {
                this.categoryTree = this.renderCategoryTree(result, null);
            });
    }

    private renderCategoryTree(categories: Category[], parentId?: number) {
        const listCategory = _.filter(categories, (category: Category) => {
            return category.parentId === parentId;
        });
        const treeData = [];
        if (listCategory) {
            _.each(listCategory, (category: Category) => {
                const childCount = _.countBy(categories, (item: Category) => {
                    return item.parentId === category.id;
                }).true;

                const children = this.renderCategoryTree(categories, category.id);
                treeData.push(new TreeData(category.id, category.parentId, category.name, false, false, category.idPath,
                    '', category, null, childCount, false, children));
            });
        }
        return treeData;
    }
}
