export class MetrikaEventOrderFailParametrizedModel {
  static title = 'неотправка заказа';
  static orderLink = 'ссылка на заказ';
  static reasonTitle = 'причина';
}

export enum MetrikaEventOrderFailParametrizedEnumModel {
  NOT_AUTHED = 'нет авторизации',
  NO_ORGANIZATIONS = 'нет организаций',
  NO_LINK = 'нет ссылки на объект заказа',
  FIELDS_NOT_VALID = 'не заполнены все обязательные поля',
}
