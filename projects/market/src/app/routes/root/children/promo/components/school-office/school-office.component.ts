import { Component } from '@angular/core';

@Component({
  templateUrl: './school-office.component.html',
  styleUrls: ['./school-office.component.scss'],
})
export class PromoSchoolOfficeComponent {
  supplierItems = [
    {
      title: 'ООО "КОМУС"',
      btnLink: '/supplier/d51a02b9-ba4f-4f0a-9288-ea8216fffac2',
      description: '- 10% на любой заказ в категории "Все для офиса", заказ от 3000 р, доставка по РФ',
      imgUrl: 'assets/img/promo/school-office/komus.png',
    },
    {
      title: 'ООО "КИТ ХОББИ"',
      btnLink: '/supplier/e911cf76-6ed8-4c03-b6be-4e8aee3465fe',
      description: '- 5% на любой заказ в категории "Все для офиса",  заказ от 1900 р, доставка по РФ',
      imgUrl: 'assets/img/promo/school-office/kit-hobby.png',
    },
    {
      title: 'ООО "А ЦИФРА"',
      btnLink: '/supplier/e945ff97-41e5-4b41-9936-17810d1141de',
      description: '- 5% на любой заказ в категории "Товары для офиса", заказ от 300 р., доставка РФ',
      imgUrl: 'assets/img/promo/school-office/a-cifra.png',
    },
  ];
  constructor() {}
}
