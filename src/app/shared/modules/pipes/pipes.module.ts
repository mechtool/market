import { NgModule } from '@angular/core';
import { MultiplierPipe } from './multiplier.pipe';
import { DeclensionPipe } from './declension.pipe';

@NgModule({
  declarations: [
    MultiplierPipe,
    DeclensionPipe,
  ],
  exports: [
    MultiplierPipe,
    DeclensionPipe,
  ],
})
export class PipesModule {}
