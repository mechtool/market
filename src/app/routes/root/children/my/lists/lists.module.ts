import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListsRoutingModule } from './lists-routing.module';
import { ListsComponent } from './lists.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ListsRoutingModule,
  ],
  declarations: [
    ListsComponent,
  ],
})
export class ListsModule { }
