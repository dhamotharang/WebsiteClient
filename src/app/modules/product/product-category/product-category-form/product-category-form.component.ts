import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {TreeData} from '../../../../view-model/tree-data';
import {Category} from '../../../website/category/category.model';
import {FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UtilService} from '../../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {IResponseResult} from '../../../../interfaces/iresponse-result';
import {BaseFormComponent} from '../../../../base-form.component';
import {CategoryProductService} from '../../services/category-product.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-category-form',
  templateUrl: './product-category-form.component.html',
  styleUrls: ['./product-category-form.component.css']
})
export class ProductCategoryFormComponent extends BaseFormComponent implements OnInit {
  @ViewChild('categoryFormModal') categoryFormModal: NhModalComponent;
  @Output() onSaveSuccess = new EventEmitter();
  categoryTree: TreeData[] = [];
  category = new Category();

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private categoryService: CategoryProductService,
              private utilService: UtilService) {
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  onFormModalShown() {
    this.utilService.focusElement('name');
  }

  onFormModalHidden() {
    this.onSaveSuccess.emit();
    this.model.reset(new Category());
  }

  add() {
    this.isUpdate = false;
    this.getCategoryTree();
    this.categoryFormModal.open();
  }

  edit(category: Category) {
    this.getCategoryTree();
    this.isUpdate = true;
    this.model.patchValue(category);
    this.categoryFormModal.open();
  }

  save() {
    const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
    if (isValid) {
      this.category = this.model.value;
      this.isSaving = true;
      if (this.isUpdate) {
        this.categoryService.update(this.category)
            .pipe(finalize(() => this.isSaving = false))
            .subscribe((result: IResponseResult) => {
              this.toastr.success(result.message);
              this.isUpdate = false;
              this.model.reset(new Category());
              this.categoryFormModal.dismiss();
            });
      } else {
        this.categoryService.insert(this.category)
            .pipe(finalize(() => this.isSaving = false))
            .subscribe((result: IResponseResult) => {
              this.toastr.success(result.message);
              this.model.reset(new Category());
              this.utilService.focusElement('name');
              this.getCategoryTree();
            });
      }
    }
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

  private buildForm() {
    this.formErrors = this.utilService.renderFormError(['name', 'description']);
    this.validationMessages = {
      'name': {
        'required': 'Vui lòng nhập tên chuyên mục',
        'maxLength': 'Tên chuyên mục không được phép vượt quá 250 ký tự.'
      },
      'description': {
        'maxLength': 'Mô tả chuyên mục không được phép vượt quá 500 ký tự.'
      }
    };
    this.model = this.fb.group({
      'id': [this.category.id],
      'name': [this.category.name, [
        Validators.required,
        Validators.maxLength(250)
      ]],
      'description': [this.category.description, [
        Validators.maxLength(500)
      ]],
      'isActive': [this.category.isActive],
      'parentId': [this.category.parentId]
    });
  }
}
