import { Component } from '@angular/core';

@Component({
  templateUrl: './school-office.component.html',
  styleUrls: ['./school-office.component.scss'],
})
export class PromoSchoolOfficeComponent {
  supplierItems = [
    {
      title: 'КОМУС',
      btnLink: '/supplier/d51a02b9-ba4f-4f0a-9288-ea8216fffac2',
      btnText: 'Подобрать товары',
      description: '- 10% в категории «Товары для офиса», доставка по РФ от 3000 р.',
      imgUrl: 'assets/img/promo/school-office/komus.png',
    },
    {
      title: 'А-ЦИФРА',
      btnLink: '/supplier/e945ff97-41e5-4b41-9936-17810d1141de',
      btnText: 'Подобрать товары',
      description: '- 5% в категории «Полиграфические услуги», доставка РФ от 300 р.',
      imgUrl: 'assets/img/promo/school-office/a-cifra.png',
    },
    {
      title: 'Все для офиса!',
      btnLink: '/category/616',
      btnText: 'Подобрать товары',
      description: 'до 10% на заказы в категории «Товары для школы и офиса»',
      imgUrl: 'assets/img/tmp/banner_2.png',
    },
  ];
  constructor() {}
}
