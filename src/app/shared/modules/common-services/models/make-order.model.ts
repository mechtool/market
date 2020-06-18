export class MakeOrderModel {
  customerOrganizationId: 'string';
  contacts: {
    name: 'string';
    email: 'string';
    phone: 'string';
  };
  deliveryOptions: {
    pickupPoint?: {
      fiasCode: 'string';
      title: 'string';
      countryOksmCode: 'string';
    };
    deliveryZone?: {
      fiasCode: 'string';
      title: 'string';
      countryOksmCode: 'string';
    }
  }
}


