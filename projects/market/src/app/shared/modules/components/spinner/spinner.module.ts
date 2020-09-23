import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { SpinnerOverlayComponent } from './spinner-overlay.component';

@NgModule({
  imports: [CommonModule],
  exports: [SpinnerComponent, SpinnerOverlayComponent],
  declarations: [SpinnerComponent, SpinnerOverlayComponent],
})
export class SpinnerModule {}
