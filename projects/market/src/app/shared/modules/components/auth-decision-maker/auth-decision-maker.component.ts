import { Component, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { AuthService } from '#shared/modules/common-services/auth.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-auth-decision-maker',
  templateUrl: './auth-decision-maker.component.html',
  styleUrls: ['./auth-decision-maker.component.scss'],
})
export class AuthDecisionMakerComponent {
  @Output() destroyModalChange: Subject<any> = new Subject();
  @Input() loginRedirectPath: string;

  constructor(private _authService: AuthService) {}

  login(): void {
    this._destroy();
    this._authService.login(this.loginRedirectPath);
  }

  register(): void {
    this._destroy();
    this._authService.register('/my/organizations?tab=c;/cart');
  }

  private _destroy() {
    this.destroyModalChange.next(true);
  }
}
