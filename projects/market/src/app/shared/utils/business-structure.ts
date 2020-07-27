// tslint:disable-next-line:max-line-length
const regExp = /индивидуальный предприниматель|общество с ограниченной ответственностью|открытое акционерное общество|закрытое акционерное общество|публичное акционерное общество/gi;

export function resizeBusinessStructure(name: string): string {
  if (name) {
    return name.replace(regExp, (form) => {
      switch (form.toLowerCase()) {
        case 'индивидуальный предприниматель':
          return 'ИП';
        case 'общество с ограниченной ответственностью':
          return 'ООО';
        case 'акционерное общество':
          return 'АО';
        case 'открытое акционерное общество':
          return 'ОАО';
        case 'закрытое акционерное общество':
          return 'ЗАО';
        case 'публичное акционерное общество':
          return 'ПАО';
        default:
          return form;
      }
    });
  }
  return name;
}
