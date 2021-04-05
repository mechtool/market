import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { CommerceMlDocumentResponseModel, CommerceOfferMlModel } from '#shared/modules';

@Component({
  selector: 'market-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: [
    './offer-view.component.scss',
    './offer-view.component-768.scss',
  ]
})
export class OfferViewComponent {
  offerData: CommerceOfferMlModel;

  @Input() set configuration(conf: { offerData: CommerceOfferMlModel }) {
    this.offerData = conf.offerData;
  }

  @Output() destroyModalChange: Subject<any> = new Subject();

  destroy(): void {
    this.destroyModalChange.next(true);
  }

}


