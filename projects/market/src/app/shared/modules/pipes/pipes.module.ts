import { NgModule } from '@angular/core';
import { MultiplierPipe } from './multiplier.pipe';
import { DeclensionPipe } from './declension.pipe';
import { ArrayJoinerPipe } from './array-joiner.pipe';
import { AvailabilityPipe } from './availability.pipe';
import { SumLettersPipe } from '#shared/modules/pipes/sum-letters.pipe';
import { NaviCounterPipe } from './navi-counter.pipe';

@NgModule({
  declarations: [
    MultiplierPipe,
    DeclensionPipe,
    ArrayJoinerPipe,
    AvailabilityPipe,
    SumLettersPipe,
    NaviCounterPipe,
  ],
  exports: [
    MultiplierPipe,
    DeclensionPipe,
    ArrayJoinerPipe,
    AvailabilityPipe,
    SumLettersPipe,
    NaviCounterPipe,
  ],
})
export class PipesModule {
}
