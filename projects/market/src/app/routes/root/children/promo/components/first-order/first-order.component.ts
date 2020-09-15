import { Component } from '@angular/core';

@Component({
  templateUrl: './first-order.component.html',
  styleUrls: ['./first-order.component.scss'],
})
export class PromoFirstOrderComponent {
  supplierItems = [
    {
      title: 'КОМУС',
      btnLink: '/supplier/d51a02b9-ba4f-4f0a-9288-ea8216fffac2',
      description: '- 10% на "Товары для школы и офиса", доставка по РФ от 3000 р.',
      imgUrl: 'assets/img/promo/first-order/komus.png',
    },
    {
      title: 'КОФРУСС',
      btnLink: '/supplier/8f70e68f-148f-4747-a5a5-fa491aff3e78',
      description: '- 10% на "Чай, Кофе, Какао", доставка по РФ',
      imgUrl: 'assets/img/promo/first-order/kofruss.png',
    },
    {
      title: 'ЧИП И ФАЙЛ',
      btnLink: '/supplier/2602f486-5d86-459f-8880-c348dafad097',
      description: '- 10% на "Товары для школы и офиса", доставка респ. Татарстан',
      imgUrl: 'assets/img/promo/first-order/chip_file.png',
    },
    {
      title: 'ЗООИННОВАЦИИ',
      btnLink: '/supplier/f92dea74-36ab-4460-a627-a1c7de1c5566',
      description: '- 10% на "Товары для животных", доставка по Москве и МО от 3500 р.',
      imgUrl: 'assets/img/promo/first-order/zoo_innovations.png',
    },
    {
      title: 'ГК Тополь',
      btnLink: '/supplier/8854323f-faea-4762-b1e7-43e75e6ab7dd',
      description: '- 10% на "Текстиль для детей", доставка по РФ от 25000 р.',
      imgUrl: 'assets/img/promo/first-order/vpk.png',
    },
    {
      title: 'ЛЕММА',
      btnLink: '/supplier/c25601e4-d0b7-4b82-b555-6477fdfe90ad',
      description: '- 10% на "Изделия из металла", заказ от 30000 р.',
      imgUrl: 'assets/img/promo/first-order/lemma.png',
    },
    {
      title: 'МКК "БАЛТИЙСКИЙ"',
      btnLink: '/supplier/f455b9e3-6005-4486-8dd6-7177633973da',
      description: '- 10% на "Консервы", доставка Санкт-Петербург и ЛО от 400000р',
      imgUrl: 'assets/img/promo/first-order/mkk.png',
    },
  ];
  constructor() {}
}
