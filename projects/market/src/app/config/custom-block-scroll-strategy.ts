import { ScrollStrategy } from '@angular/cdk/overlay';

export class CustomBlockScrollStrategy implements ScrollStrategy {
  enable() {
    try {
      document.documentElement.classList.add('cdk-global-custom-scrollblock');
    }catch (err){}  }
  disable() {
    try {
      document.documentElement.classList.remove('cdk-global-custom-scrollblock');
    }catch (err){}  }
  attach() {}
}
