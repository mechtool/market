import { Component } from '@angular/core';

@Component({
  selector: 'market-main-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class MainBannersComponent {
  items = [
    {
      title: 'Скидка 10% на первый заказ!',
      btnLink: '/promo/first-order',
      btnText: 'Подробнее',
      description: 'До 15 ноября скидки от Поставщиков',
      imgUrl: 'assets/img/tmp/banner_1.png',
    },
    {
      title: 'Все для офиса!',
      btnLink: '/category/616',
      btnText: 'Подробнее',
      description: 'до 10% на заказы в категории «Товары для школы и офиса»',
      imgUrl: 'assets/img/tmp/banner_2.png',
    },
    {
      title: 'Все для магазина и ресторана!',
      btnLink: '/supplier/889f29b7-7766-4da1-9397-06ab88cbc7cd',
      btnText: 'Подробнее',
      description: '> 7000 товаров в категории «Продукты, напитки, табак»',
      imgUrl: 'assets/img/tmp/banner_3.png',
    },
  ];

  constructor() {}
}
