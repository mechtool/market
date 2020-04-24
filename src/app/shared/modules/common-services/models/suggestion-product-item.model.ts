export class SuggestionProductItemModel {
  id: string;
  name: string;
  offers: number;
  highlight: string;
  images?: SuggestionProductItemImageLinkModel[];
}

export class SuggestionProductItemImageLinkModel {
  href: string;
}
