import { NgModule } from '@angular/core';
import { MultiplierPipe } from './multiplier.pipe';
import { DeclensionPipe } from './declension.pipe';
import { ArrayJoinerPipe } from './array-joiner.pipe';

@NgModule({
  declarations: [
    MultiplierPipe,
    DeclensionPipe,
    ArrayJoinerPipe,
  ],
  exports: [
    MultiplierPipe,
    DeclensionPipe,
    ArrayJoinerPipe,
  ],
})
export class PipesModule {}
