import { Component, ViewEncapsulation } from '@angular/core';
import { PagesStaticService } from '#shared/modules/common-services';

@Component({
  template: '<div class="promo" [innerHTML]="content | marketSafeHtml"></div>',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PromoListComponent {
  content: string;

  constructor(private pagesStaticService: PagesStaticService) {
    pagesStaticService.getPageStatic()
      .subscribe((page) => {
        this.content = page._embedded.items?.[0]?.content;
      });
  }
}
