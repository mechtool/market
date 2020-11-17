/**
 * Категории участвующие в промоакциях и на страницах которых нужно отображать банеры
 * Пока решаем в лоб, когда категории начнут добавлять админы, то нужно будет пересмотреть
 */

export const categoryPromotion = {
  616: [
    {
      title: 'КОМУС',
      btnLink: '/supplier/d51a02b9-ba4f-4f0a-9288-ea8216fffac2',
      btnText: 'Подобрать товары',
      description: '- 10% в категории «Товары для офиса», доставка по РФ от 3000 р.',
      imgUrl: 'assets/img/promo/school-office/komus.png',
    },
    {
      title: 'КИТ ХОББИ',
      btnLink: '/supplier/e911cf76-6ed8-4c03-b6be-4e8aee3465fe',
      btnText: 'Подобрать товары',
      description: '- 5% в категории «Товары для офиса», доставка по РФ от 1900 р.',
      imgUrl: 'assets/img/promo/school-office/kit-hobby.jpg',
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
      btnLink: '/promo/school-office',
      btnText: 'Условия акции',
      description: 'до 10% на заказы в категории «Товары для школы и офиса»',
      imgUrl: 'assets/img/tmp/banner_2.png',
    },
  ],
  3321: [
    {
      title: 'МЕТРО',
      btnLink: '/supplier/889f29b7-7766-4da1-9397-06ab88cbc7cd',
      btnQueryParams: {
        categoryId: '3321',
        isDelivery: true,
        isPickup: true,
        sort: 'minPriceAsc'
      },
      btnText: 'Подобрать товары',
      description: '>7000 товаров в категории "Продукты, напитки, табак", заказ от 10000 р.',
      imgUrl: 'assets/img/promo/metro.jpg',
    },
    {
      title: 'КОМУС',
      btnLink: '/supplier/d51a02b9-ba4f-4f0a-9288-ea8216fffac2',
      btnQueryParams: {
        categoryId: '3321',
        isDelivery: true,
        isPickup: true,
      },
      btnText: 'Подобрать товары',
      description: '- 10% на "Продукты, напитки, табак", цены указаны со скидкой, заказ от 3000 р.',
      imgUrl: 'assets/img/promo/school-office/komus.png',
    },
    {
      title: 'КИТ ХОББИ',
      btnLink: '/supplier/e911cf76-6ed8-4c03-b6be-4e8aee3465fe',
      btnText: 'Подобрать товары',
      description: '- 5% на "Чай, кофе, какао", доставка по РФ от 1900 р.',
      imgUrl: 'assets/img/promo/school-office/kit-hobby.jpg',
    },
    {
      title: 'КОФРУСС',
      btnLink: '/supplier/8f70e68f-148f-4747-a5a5-fa491aff3e78',
      btnText: 'Подобрать товары',
      description: '- 10% первый заказ на "Чай, Кофе, Какао", доставка по РФ.',
      imgUrl: 'assets/img/promo/kofruss.png',
    }
  ]
};
