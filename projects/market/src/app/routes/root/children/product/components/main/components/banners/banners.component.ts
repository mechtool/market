import { Component } from '@angular/core';

@Component({
  selector: 'market-main-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class MainBannersComponent {
  items = [
    {
      title: 'Скидка 7% на электронику и комплектующие!',
      btnLink: '/supplier/df39ca07-ef02-4e3f-b7f1-eb66fbeb8f68',
      btnText: 'Подробнее',
      description: 'При заказе у официального дистрибьютора RS Components',
      imgUrl: 'assets/img/tmp/banner_4.png',
    },
    {
      title: 'Скидка 10% на первый заказ!',
      btnLink: '/promo/first-order',
      btnText: 'Подробнее',
      description: 'до 28 февраля скидки от Поставщиков',
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
      btnLink: '/category/3321',
      btnText: 'Подробнее',
      description: '> 7000 товаров в категории «Продукты, напитки, табак»',
      imgUrl: 'assets/img/tmp/banner_3.png',
    },
  ];

  constructor() {}
}
