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
import { CurrencyPricePipe } from './currency.pipe';
import { AbbreviatedBusinessNamePipe } from './abbreviated-business-name.pipe';
import { CurrencyPipe } from '@angular/common';
import { OrganizationLogoPipe } from './organization-logo.pipe';
import { FeatureValuePipe } from './feature-value.pipe';

@NgModule({
  declarations: [
    MultiplierPipe,
    DeclensionPipe,
    PlaceJoinerPipe,
    ArrayJoinerPipe,
    AvailabilityPipe,
    SumLettersPipe,
    NaviCounterPipe,
    FoundPipe,
    StockPipe,
    CurrencyPricePipe,
    AbbreviatedBusinessNamePipe,
    OrganizationLogoPipe,
    FeatureValuePipe,
  ],
  exports: [
    MultiplierPipe,
    DeclensionPipe,
    PlaceJoinerPipe,
    ArrayJoinerPipe,
    AvailabilityPipe,
    SumLettersPipe,
    NaviCounterPipe,
    FoundPipe,
    StockPipe,
    CurrencyPricePipe,
    AbbreviatedBusinessNamePipe,
    OrganizationLogoPipe,
    FeatureValuePipe,
  ],
  providers: [
    CurrencyPipe
  ],
})
export class PipesModule {
}
