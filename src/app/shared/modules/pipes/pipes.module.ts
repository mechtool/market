import { NgModule } from '@angular/core';
import { MultiplierPipe } from './multiplier.pipe';

@NgModule({
  declarations: [
    MultiplierPipe,
  ],
  exports: [
    MultiplierPipe,
  ],
})
export class PipesModule {}
