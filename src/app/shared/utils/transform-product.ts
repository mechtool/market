import {
  ImagesLinkDto,
  ProductDto,
  ProductFeatureDto, ProductFeatureModel,
  ProductManufacturerDto,
  ProductModel,
  TradeOfferProductModel,
  TradeOfferResponseModel,
  ValueTypeEnum
} from '#shared/modules';

export function mapTradeOffer(tradeOffer: TradeOfferResponseModel): ProductDto {
  return {
    categoryId: tradeOffer.product.supplierNomenclature?.ref1Cn?.categoryId
      || tradeOffer.product.ref1cNomenclature?.categoryId,
    categoryName: tradeOffer.product.supplierNomenclature?.ref1Cn?.categoryName
      || tradeOffer.product.ref1cNomenclature?.categoryName,
    productName: tradeOffer.product.supplierNomenclature?.productName
      || tradeOffer.product.ref1cNomenclature?.productName,
    productDescription: tradeOffer.product.supplierNomenclature?.productDescription
      || tradeOffer.product.ref1cNomenclature?.productDescription,
    productPartNumber: tradeOffer.product.supplierNomenclature?.productPartNumber
      || tradeOffer.product.ref1cNomenclature?.productPartNumber,
    productBarCodes: tradeOffer.product.supplierNomenclature?.productBarCodes
      || tradeOffer.product.ref1cNomenclature?.productBarCodes,
    features: _mapRequisites(tradeOffer.product),
    manufacturer: _mapManufacture(tradeOffer.product),
    images: _mapImages(tradeOffer.product),
  };
}

export function mapProductOffer(product: ProductModel): ProductDto {
  return {
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    productName: product.productName,
    productDescription: product.productDescription,
    productPartNumber: product.productPartNumber,
    productBarCodes: product.productBarCodes,
    features: _mapFeatures(product.features),
    manufacturer: product.manufacturer,
    images: product.images,
  };
}

function _mapFeatures(features: ProductFeatureModel[]): ProductFeatureDto[] {
  return features.map((req) => {
    return {
      featureId: req.featureId,
      featureName: req.featureName,
      value: req.value,
      valueName: req.valueName,
      valueType: ValueTypeEnum[req.valueType],
    };
  });
}

function _mapRequisites(product: TradeOfferProductModel): ProductFeatureDto[] {
  if (product.ref1cNomenclature?.requisites) {
    return product.ref1cNomenclature.requisites.map((req) => {
      return {
        featureId: req.id,
        featureName: req.name,
        value: req.value,
        valueName: req.valueName,
        valueType: ValueTypeEnum[req.valueType],
      };
    });

  }
  return undefined;
}

function _mapManufacture(product: TradeOfferProductModel): ProductManufacturerDto {
  if (product.ref1cNomenclature?.manufacturer) {
    return {
      name: product.ref1cNomenclature.manufacturer.name,
      tradeMark: product.ref1cNomenclature.manufacturer.tradeMark
    };
  }

  if (product.supplierNomenclature?.manufacturer) {
    return {
      name: product.supplierNomenclature.manufacturer.name,
      tradeMark: product.supplierNomenclature.manufacturer.tradeMark
    };
  }
  return undefined;
}

function _mapImages(product: TradeOfferProductModel): ImagesLinkDto[] {
  if (product.ref1cNomenclature?.imageUrls) {
    return product.ref1cNomenclature.imageUrls.map((img) => {
      return { href: img };
    });
  }

  if (product.supplierNomenclature?.imageUrls) {
    return product.supplierNomenclature.imageUrls.map((img) => {
      return { href: img };
    });
  }
  return undefined;
}

