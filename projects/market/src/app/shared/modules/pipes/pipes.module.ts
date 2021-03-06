import { NgModule } from '@angular/core';
import { MultiplierPipe } from './multiplier.pipe';
import { DeclensionPipe } from './declension.pipe';
import { ArrayJoinerPipe } from './array-joiner.pipe';
import { AvailabilityPipe } from './availability.pipe';
import { SumLettersPipe } from './sum-letters.pipe';
import { NaviCounterPipe } from './navi-counter.pipe';
import { FoundPipe } from './found.pipe';
import { PlaceJoinerPipe } from './place-joiner.pipe';
import { StockPipe } from './stock.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { CurrencyPricePipe } from './currency-price.pipe';
import { CurrencyCodePipe } from './currency-code.pipe';
import { AbbreviatedBusinessNamePipe } from './abbreviated-business-name.pipe';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrganizationLogoPipe } from './organization-logo.pipe';
import { FeatureValuePipe } from './feature-value.pipe';
import { LocalityJoinerPipe } from './locality-joiner.pipe';
import { OfferDescriptionJoinerPipe } from './offer-description-joiner.pipe';
import { DeliveryMethodPipe } from './delivery-method.pipe';
import { HiddenSymbolsPipe } from './hidden-symbols.pipe';
import { MinPricePipe } from './min-price.pipe';
import { CastControlPipe } from './cast-control.pipe';
import { YesNoPipe } from './yes-no.pipe';
import { DocumentStatusPipe } from './document-status.pipe';
import { DocumentStatusMessagePipe } from './document-status-message.pipe';
import { PriceListStatusPipe } from './price-list-status.pipe';
import { PriceListStatusMessagePipe } from './price-list-status-message.pipe';
import { LogPipe } from './log.pipe';
import { MinQuantityPipe } from './min-quantity.pipe';
import { SlicerPipe } from './slicer.pipe';

@NgModule({
  declarations: [
    MultiplierPipe,
    MinPricePipe,
    DeclensionPipe,
    DocumentStatusPipe,
    DocumentStatusMessagePipe,
    PlaceJoinerPipe,
    ArrayJoinerPipe,
    AvailabilityPipe,
    SumLettersPipe,
    NaviCounterPipe,
    FoundPipe,
    StockPipe,
    SafeHtmlPipe,
    CurrencyPricePipe,
    CurrencyCodePipe,
    AbbreviatedBusinessNamePipe,
    OrganizationLogoPipe,
    FeatureValuePipe,
    LocalityJoinerPipe,
    OfferDescriptionJoinerPipe,
    DeliveryMethodPipe,
    HiddenSymbolsPipe,
    CastControlPipe,
    YesNoPipe,
    PriceListStatusPipe,
    PriceListStatusMessagePipe,
    LogPipe,
    MinQuantityPipe,
    SlicerPipe,
  ],
  exports: [
    MultiplierPipe,
    MinPricePipe,
    DeclensionPipe,
    DocumentStatusPipe,
    DocumentStatusMessagePipe,
    PlaceJoinerPipe,
    ArrayJoinerPipe,
    AvailabilityPipe,
    SumLettersPipe,
    NaviCounterPipe,
    FoundPipe,
    StockPipe,
    SafeHtmlPipe,
    CurrencyPricePipe,
    CurrencyCodePipe,
    AbbreviatedBusinessNamePipe,
    OrganizationLogoPipe,
    FeatureValuePipe,
    LocalityJoinerPipe,
    OfferDescriptionJoinerPipe,
    DeliveryMethodPipe,
    HiddenSymbolsPipe,
    CastControlPipe,
    YesNoPipe,
    PriceListStatusPipe,
    PriceListStatusMessagePipe,
    LogPipe,
    MinQuantityPipe,
    SlicerPipe,
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
  ],
})
export class PipesModule {
}
