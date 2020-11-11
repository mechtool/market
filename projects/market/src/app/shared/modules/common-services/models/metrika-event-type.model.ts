export enum MetrikaEventTypeModel {
  ORDER_CREATE = 'ORDER_CREATE',
  ORDER_PUT = 'ORDER_PUT',
  ORDER_TRY_PARAMETRIZED = 'ORDER_TRY_PARAMETRIZED',
  ORDER_FAIL_PARAMETRIZED = 'ORDER_FAIL_PARAMETRIZED',
  TRY_ORDER = 'TRY_ORDER',
  PRICEREQUEST_CREATE = 'PRICEREQUEST_CREATE',
  ORG_REGISTER = 'ORG_REGISTER',
  SIGN_IN = 'LOGIN1C_ENTER',
  REGISTER = 'LOGIN1C_REGISTER',
  MODAL_AUTH_SIGN_IN = 'LOGIN1C_ENTER_MODAL',
  MODAL_AUTH_REGISTER = 'LOGIN1C_REGISTER_MODAL',
  MODAL_AUTH_CLOSE = 'AUTH_CLOSE_MODAL',
  MODAL_CHECK_INN_SHOW = 'ORG_REGISTER_START',
  APP_INIT_PROBLEMS = 'APP_INIT_PROBLEMS',
}