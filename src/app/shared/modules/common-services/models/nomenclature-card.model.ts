export class NomenclatureCardModel {
  id: string;
  productName: string;
  imageUrl: string;
  offersSummary: {
    minPrice: number;
    totalOffers: number;
  };

  constructor(params) {
    Object.assign(this, params);
  }
}
