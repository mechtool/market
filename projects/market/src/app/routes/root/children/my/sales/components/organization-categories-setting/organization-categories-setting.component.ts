import { Component, Input, OnInit } from '@angular/core';
import { CategoriesMappingModelRow, CategoryService, NotificationsService, SpinnerService } from '#shared/modules';
import { take } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CategorySearchFormComponent } from '../category-search-form/category-search-form.component';

@Component({
  selector: 'market-organization-categories-setting',
  templateUrl: './organization-categories-setting.component.html',
  styleUrls: [
    './organization-categories-setting.component.scss',
    './organization-categories-setting.component-768.scss',
    './organization-categories-setting.component-400.scss',
  ],
})
export class OrganizationCategoriesSettingComponent implements OnInit {
  @Input() organizationId: string;
  categoriesMapping: CategoriesMappingModelRow[];

  constructor(
    private _modalService: NzModalService,
    private _spinnerService: SpinnerService,
    private _categoryService: CategoryService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    this._spinnerService.show();
    this._categoryService.getCategoriesMapping(this.organizationId)
      .subscribe((res) => {
        this.categoriesMapping = res.mapping.map((cm) => {
          return {
            externalCategoryName: cm.externalCategoryName,
            ref1CnCategoryId: cm.ref1CnCategoryId,
            ref1CnCategoryName: this._categoryService.get1CnCategory(cm.ref1CnCategoryId).name,
          };
        });
        this._spinnerService.hide();
      }, (err) => {
        this._spinnerService.hide();
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }

  changeCategory(mapping: any) {
    const modal = this._modalService.create({
      nzTitle: 'Выберите категорию 1СН',
      nzContent: CategorySearchFormComponent,
      nzFooter: null,
      nzWidth: 550,
      nzComponentParams: {}
    });

    modal.componentInstance.categoryChange
      .pipe(take(1))
      .subscribe((category) => {
        const index = this.categoriesMapping.findIndex(cm => cm.externalCategoryName === mapping.externalCategoryName);
        if (index >= 0) {
          this.categoriesMapping.splice(index, 1, {
            externalCategoryName: mapping.externalCategoryName,
            ref1CnCategoryId: category.categoryId,
            ref1CnCategoryName: category.categoryName,
          });
          this.save();
        }
        modal.destroy();
      });
  }

  private save() {
    this._categoryService.saveCategoriesMapping(this.organizationId, {
      mapping: this.categoriesMapping.map((cm) => {
        return {
          externalCategoryName: cm.externalCategoryName,
          ref1CnCategoryId: cm.ref1CnCategoryId,
        }
      }),
    }).subscribe((res) => {
      this._notificationsService.info('Настройки рубрикации сохранены. Для применения изменений к торговым предложениям запустите процесс обновления прайс-листа.');
    }, (err) => {
      this._notificationsService.error('Невозможно сохранить настройки рубрикации. Внутренняя ошибка сервера, попробуйте позже.');
    });
  }
}

