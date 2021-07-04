import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser} from '@angular/common';
import {SwUpdate} from '@angular/service-worker';

@Injectable({
  providedIn : 'root'
})
export class SwUpdateService implements OnDestroy{
  public subs = [];
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private swUpdate : SwUpdate) {

    if (isPlatformBrowser (this._platformId) && this.swUpdate.isEnabled){
        this.subs.push(this.swUpdate.available.subscribe( () => {
            // Предупреждение пользователю о том, что новая версия появилась на сайте
          // todo Временная функция подтверждения
          if (this.confirmUser()) { // Удалить
            this.swUpdate.activateUpdate().then(() => document.location.reload());
          }
        }));
    }
  }

  ngOnDestroy() {
    this.subs.forEach( (s) => s.unsubscribe());
  }

  confirmUser(){
   return window.confirm('Загрузить обновленное приложение?')
  }
}
