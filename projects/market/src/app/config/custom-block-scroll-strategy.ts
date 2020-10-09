import { ScrollStrategy } from '@angular/cdk/overlay';

export class CustomBlockScrollStrategy implements ScrollStrategy {
  enable() {
    document.documentElement.classList.add('cdk-global-custom-scrollblock');
    document.documentElement.style.overflow = 'hidden';
  }
  disable() {
    document.documentElement.classList.remove('cdk-global-custom-scrollblock');
    document.documentElement.style.overflow = 'visible auto';
  }
  attach() {}
}
