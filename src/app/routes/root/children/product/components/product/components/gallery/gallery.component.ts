import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NomenclatureModel } from '#shared/modules';

@Component({
  selector: 'my-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: [
    './gallery.component.scss',
    './gallery.component-768.scss'
  ],
})
export class GalleryComponent implements OnInit, OnDestroy {

  @Input() nomenclature: NomenclatureModel;

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
