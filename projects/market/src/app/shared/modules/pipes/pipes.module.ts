import { NgModule } from '@angular/core';
import { MultiplierPipe } from './multiplier.pipe';
import { DeclensionPipe } from './declension.pipe';
import { ArrayJoinerPipe } from './array-joiner.pipe';
import { AvailabilityPipe } from './availability.pipe';
import { SumLettersPipe } from '#shared/modules/pipes/sum-letters.pipe';
import { NaviCounterPipe } from './navi-counter.pipe';
import { FoundPipe } from './found.pipe';
import { PlaceJoinerPipe } from './place-joiner.pipe';

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
  ],
})
export class PipesModule {
}
