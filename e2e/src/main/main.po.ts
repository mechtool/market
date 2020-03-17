// import { by, element, ElementArrayFinder, ElementFinder, browser } from 'protractor';
// import { AppPage } from './../app.po';
// import { OrganizationModel } from './models';
// import { presenceOfAll } from '../utils/utils';

// export class OrganizationsPage {

//   async getRouteTitleText(): Promise<string> {
//     const routeTitleElement = element(by.css('.organizations > nz-card > div > div > div > div > span'));
//     return await routeTitleElement.getText();
//   }

//   getAddOrganizationBtn() {
//     const addOrganizationBtn = element(by.cssContainingText('.organizations button', 'Добавить организацию'));
//     return addOrganizationBtn;
//   }

//   getOrganizationsElements(): ElementArrayFinder {
//     const organizationsElements = element.all(by.css('.organizations nz-list-item'));
//     return organizationsElements;
//   }

//   getEmptyOrganizationsElement() {
//     const emptyOrganizationsElement = element(by.css('.organizations nz-empty'));
//     console.log(emptyOrganizationsElement);
//     return emptyOrganizationsElement;
//   }

// }

