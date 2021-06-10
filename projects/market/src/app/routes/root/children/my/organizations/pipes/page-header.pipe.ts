import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketPageHeader',
})
export class PageHeaderPipe implements PipeTransform {
  transform(value: string): string {
    return value === 'c' ? 'Регистрация новой организации' : 'Мои организации';
  }
}

