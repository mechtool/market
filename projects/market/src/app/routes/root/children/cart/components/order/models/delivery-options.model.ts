export class DeliveryOptionAddressModel {
  fiasCode: string;
  title: string;
  countryOksmCode: string;
}

export class DeliveryOptionsModel {
  pickupPoints?: DeliveryOptionAddressModel[];
  deliveryZones?: DeliveryOptionAddressModel[];
}
