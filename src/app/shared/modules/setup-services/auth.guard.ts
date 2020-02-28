import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  CanActivate
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return true;
  }
}


