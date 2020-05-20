import { ImagesLinkModel } from '#shared/modules';

export class SuggestionProductItemModel {
  id: string;
  name: string;
  offers: number;
  highlight: string;
  images?: ImagesLinkModel[];
}
