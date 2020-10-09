import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { CategoryComponent } from './category.component';

const routes: Routes = [
  {
    matcher: (segments) => {
      if (segments.length <= 1) {
        return {
          consumed: segments,
          posParams: {
            id: new UrlSegment(segments[0]?.path || '', {}),
          },
        };
      }
      return null;
    },
    pathMatch: 'prefix',
    component: CategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
