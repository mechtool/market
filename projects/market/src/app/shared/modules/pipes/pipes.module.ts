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
import { AvailableQuantityProductsPipe } from './available-quantity-products.pipe';

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
    AvailableQuantityProductsPipe
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
    AvailableQuantityProductsPipe
  ],
})
export class PipesModule {
}
