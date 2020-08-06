export class CartCreateOrderRequestModel {
  customerOrganizationId: 'string';
  contacts: {
    name: 'string';
    email: 'string';
    phone: 'string';
  };
  deliveryOptions: {
    pickupFrom?: {
      fiasCode: 'string';
      title: 'string';
      countryOksmCode: 'string';
    };
    deliveryTo?: {
      fiasCode: 'string';
      title: 'string';
      countryOksmCode: 'string';
    }
  }
}


