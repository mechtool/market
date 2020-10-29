import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechRoutingModule } from './tech-routing.module';
import { TechComponent } from './tech.component';

@NgModule({
  imports: [CommonModule, FormsModule, TechRoutingModule],
  declarations: [TechComponent],
})
export class TechModule {}
