import { Component, OnDestroy } from '@angular/core';
import { combineLatest, of, Subscription, throwError } from 'rxjs';
import {
  CounterpartyResponseModel,
  CountryCode,
  ProductDto,
  SuppliersItemModel,
  TradeOfferResponseModel,
  TradeOfferSupplierModel
} from '#shared/modules/common-services/models';
import {
  CartPromoterService,
  ExternalProvidersService, LocalStorageService,
  LocationService,
  NotificationsService,
  OrganizationsService,
  TradeOffersService,
} from '#shared/modules/common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TradeOfferUnavailabilityComponent } from '../trade-offer-unavailability/trade-offer-unavailability.component';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { unsubscribeList } from '#shared/utils';

@Component({
  templateUrl: './trade-offer.component.html',
  styleUrls: [
    './trade-offer.component.scss',
    './trade-offer.component-992.scss',
  ],
})
export class TradeOfferComponent implements OnDestroy {
  product: ProductDto;
  supplier: SuppliersItemModel;
  tradeOffer: TradeOfferResponseModel;
  modal: NzModalRef;

  private _isRegionSelectedSubscription: Subscription;

  get hasProductDescription(): boolean {
    return !(this.product.productDescription || this.product.features?.length);
  }

  constructor(
    private _meta: Meta,
    private _router: Router,
    private _modalService: NzModalService,
    private _activatedRoute: ActivatedRoute,
    private _locationService: LocationService,
    private _tradeOffersService: TradeOffersService,
    private _cartPromoterService: CartPromoterService,
    private _localStorageService: LocalStorageService,
    private _organizationsService: OrganizationsService,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
    this._initTradeOffer();
  }

  ngOnDestroy(): void {
    this.modal?.destroy();
    this._cartPromoterService.stop();
    this._meta.removeTag('itemprop="identifier"');
    unsubscribeList([this._isRegionSelectedSubscription]);
  }

  madeOrder(isMadeOrder: boolean) {
    if (isMadeOrder) {
      this._cartPromoterService.start();
    } else {
      this._cartPromoterService.stop();
    }
  }

  private _initTradeOffer() {
    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          return this._tradeOffersService.get(params.tradeOfferId);
        }),
        tap((tradeOffer) => {
          const tag = {
            event: 'ProductPage',
            ecommerce: {
              detail: {
                products: [
                  {
                    name: tradeOffer.product?.ref1cNomenclature?.productName || tradeOffer.product?.supplierNomenclature?.productName || '',
                    id: tradeOffer.sid || '',
                    price: tradeOffer.termsOfSale?.price?.matrix?.[0]?.price ? tradeOffer.termsOfSale.price.matrix[0].price / 100 : '',
                    brand:
                      tradeOffer.product?.ref1cNomenclature?.manufacturer?.tradeMark ||
                      tradeOffer.product?.supplierNomenclature?.manufacturer?.tradeMark ||
                      '',
                    category:
                      tradeOffer.product?.ref1cNomenclature?.categoryName ||
                      tradeOffer.product?.supplierNomenclature?.ref1Cn?.categoryName ||
                      '',
                    variant: tradeOffer.supplier?.name || '',
                  },
                ],
              },
            },
          };
          this._externalProvidersService.fireGTMEvent(tag);
        }),
        tap((tradeOffer) => {
          this._meta.updateTag({ itemprop: 'identifier', content: tradeOffer.sid });
        }),
        switchMap((tradeOffer) => {
          const inn = tradeOffer.supplier.inn;
          return combineLatest([of(tradeOffer), this._organizationsService.findCounterpartyDataByInn(inn)])
        }),
        catchError((err) => {
          return throwError(err);
        }),
      ).subscribe(([tradeOffer, counterparty]) => {
        this.tradeOffer = tradeOffer;
        this.product = ProductDto.fromTradeOffer(tradeOffer);
        this.supplier = this._mapSupplier(tradeOffer.supplier, counterparty);
        this._openModalTradeOfferUnavailabilityIfNecessary();
      },
      (err) => {
        if (err.status === 404) {
          this._router.navigate(['/404']);
        } else {
          this._notificationsService.error();
        }
      },
    );
  }

  private _openModalTradeOfferUnavailabilityIfNecessary() {
    const selectedCustomLocation = this._locationService.getSelectedCustomLocation();

    if (!this._localStorageService.isApproveRegion() || !selectedCustomLocation || this._deliveryByRussia() || this._pickupFromHasFias(selectedCustomLocation.fias)) {
      return;
    } else {
      const validDeliveryFiasCode = this.tradeOffer.deliveryDescription?.deliveryRegions?.reduce((accum, curr) => {
        if (curr.fiasCodes.length) {
          accum.push(...curr.fiasCodes);
        }
        return accum;
      }, []) || [];

      this._locationService.isDeliveryAvailable(selectedCustomLocation.fias, validDeliveryFiasCode)
        .subscribe((isAvailable) => {
          if (!isAvailable) {
            this.modal = this._modalService.create({
              nzTitle: 'Поставка невозможна',
              nzContent: TradeOfferUnavailabilityComponent,
              nzFooter: null,
              nzWidth: 480,
              nzComponentParams: {
                locality: selectedCustomLocation.locality
              },
            });

            const subscription = this.modal.componentInstance.changeRegionEvent
              .subscribe((success) => {
                if (success) {
                  this.modal.destroy()
                  subscription.unsubscribe();
                  this._localStorageService.resetRegion();
                  window.location.reload();
                }
              });
          }
        });
    }
  }

  private _deliveryByRussia(): boolean {
    const deliveryRegions = this.tradeOffer.deliveryDescription.deliveryRegions;
    return !deliveryRegions || !deliveryRegions?.length || deliveryRegions.some((place) => !place.fiasCodes?.length && place.countryOksmCode === CountryCode.RUSSIA);
  }

  private _pickupFromHasFias(fias: string): boolean {
    const pickupFrom = this.tradeOffer.deliveryDescription.pickupFrom;
    return pickupFrom?.some((pf) => pf.fiasCodes.includes(fias));
  }

  private _mapSupplier(supplier: TradeOfferSupplierModel, counterparty: CounterpartyResponseModel): SuppliersItemModel {
    return {
      id: supplier.bnetInternalId,
      name: supplier.name,
      inn: supplier.inn,
      kpp: supplier.kpp,
      description: supplier.description,
      email: supplier.contactPerson?.email,
      phone: supplier.contactPerson?.phone,
      personName: supplier.contactPerson?.name,
      publicInfo: counterparty,
      isVerifiedOrg: supplier.isVerifiedOrg,
    };
  }
}
