import { Component, OnDestroy } from '@angular/core';
import { ResponsiveService } from '#shared/modules';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';

@Component({
  selector: 'market-product-range',
  templateUrl: './product-range.component.html',
  styleUrls: ['./product-range.component.scss'],
})
export class ProductRangeComponent implements OnDestroy {

  private readonly _innerWidthSubscription: Subscription;
  count: number;
  groups = [
    {
      title: 'Против вируса',
      url: '/category/3349',
      img: './assets/img/product-range/mask.jpeg',
      items: [
        {
          title: 'Маски',
          url: '/category/3349',
          queryParams: {
            q: 'маска',
            withImages: true
          },
        },
        {
          title: 'Перчатки',
          url: '/category/3349',
          queryParams: {
            q: 'перчатки',
            withImages: true
          },
        },
        {
          title: 'Антисептик',
          url: '/category/3349',
          queryParams: {
            q: 'антисептик',
            withImages: true
          },
        },
        {
          title: 'Очистители воздуха',
          url: '/category/3349',
          queryParams: {
            q: 'облучатель-рециркулятор',
            withImages: true
          },
        },
      ]
    },
    {
      title: 'Товары для офиса',
      url: '/category/616',
      img: './assets/img/product-range/paper.jpeg',
      items: [
        {
          title: 'Бумага',
          url: '/category/616',
          queryParams: {
            q: 'Бумага А3 А4',
            withImages: true
          },
        },
        {
          title: 'Расходные материалы',
          url: '/category',
          queryParams: {
            q: 'тонер картридж фотобарабан',
            withImages: true
          },
        },
        {
          title: 'Канцтовары',
          url: '/category/1057',
          queryParams: {
            withImages: true
          },
        },
        {
          title: 'Хозтовары',
          url: '/category/2993',
          queryParams: {
            withImages: true
          },
        },
        {
          title: 'Офисная мебель',
          url: '/category/2441',
          queryParams: {
            withImages: true
          },
        },
      ]
    },
    {
      title: 'Компьютеры и оргтехника',
      url: '/category/1',
      img: './assets/img/product-range/printer.jpeg',
      items: [
        {
          title: 'Принтеры и МФУ',
          url: '/category/8539',
          queryParams: {
            withImages: true
          },
        },
        {
          title: 'Настольные компьютеры',
          url: '/category/5',
          queryParams: {
            withImages: true
          },
        },
        {
          title: 'Ноутбуки',
          url: '/category/8',
          queryParams: {
            withImages: true
          },
        },
        {
          title: 'Программное обеспечение',
          url: '/category/80',
          queryParams: {
            withImages: true
          },
        },
      ]
    },
    {
      title: 'Продукты питания',
      url: '/category/3321',
      img: './assets/img/product-range/cookie.jpeg',
      items: [
        {
          title: 'Вода',
          url: '/category/3321',
          queryParams: {
            q: 'вода',
            withImages: true
          },
        },
        {
          title: 'Кофе и чай',
          url: '/category/1308',
          queryParams: {
            withImages: true
          },
        },
        {
          title: 'Кондитерские изделия',
          url: '/category/2743',
          queryParams: {
            withImages: true
          },
        },
      ]
    },
    {
      title: 'Электрооборудование и электроника',
      url: '/category/651',
      img: './assets/img/product-range/light_bulb.jpeg',
      items: [
        {
          title: 'Розетки и выключатели',
          url: '/category',
          queryParams: {
            q: 'розетка',
            withImages: true
          },
        },
        {
          title: 'Осветительные приборы',
          url: '/category',
          queryParams: {
            q: 'лампы',
            withImages: true
          },
        },
        {
          title: 'Электронные компоненты',
          url: '/category/6814',
          queryParams: {
            withImages: true
          },
        },
      ]
    },
    {
      title: 'Автозапчасти',
      url: '/category/5681',
      img: './assets/img/product-range/oil.jpg',
      items: [
        {
          title: 'Моторные масла',
          url: '/category/5681',
          queryParams: {
            withImages: true
          },
        },
        {
          title: 'Аккумуляторы',
          url: '/category/5677',
          queryParams: {
            q: 'аккумулятор',
            withImages: true
          },
        },
        {
          title: 'Тормозные колодки',
          url: '/category/5677',
          queryParams: {
            q: 'тормозные колодки',
            withImages: true
          },
        },
      ]
    },
  ];

  constructor(private _responsiveService: ResponsiveService) {
    this._innerWidthSubscription = this._responsiveService.screenWidth$.subscribe((innerWidth) => {
      if (innerWidth <= 576) {
        this.count = 1;
      } else if (innerWidth > 576 && innerWidth <= 992) {
        this.count = 2;
      } else {
        this.count = 3
      }
    });
  }

  ngOnDestroy(): void {
    unsubscribeList([this._innerWidthSubscription]);
  }

}
