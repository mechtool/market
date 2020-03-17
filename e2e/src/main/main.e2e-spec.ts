
// import { browser, ExpectedConditions as until } from 'protractor';
// import { LoginItsPage } from './../login-its/login-its.po';
// import { OrganizationsPage } from './organizations.po';
// import { waitForUrlToChangeTo, navigateTo, logout } from '../utils/utils';

// describe('Когда открывается роут /organizations напрямую', async () => {
//   const loginItsPage = new LoginItsPage();
//   const orgsPage = new OrganizationsPage();

//   beforeAll(async () => {
//     await browser.waitForAngularEnabled(false);
//     await navigateTo(`${browser.baseUrl}organizations`);
//     await loginItsPage.authUser();
//     await waitForUrlToChangeTo('/organizations');
//   });

//   it(`заголовок должен быть 'Мои организации'`, async () => {
//     await expect(orgsPage.getRouteTitleText()).toEqual('Мои организации');
//   });

//   it(`должна присутствовать кнопка 'Добавить организацию'`, async () => {
//     await expect(orgsPage.getAddOrganizationBtn().isPresent()).toBe(true);
//   });

//   it(`должен присутствовать список организаций или он должен быть пуст`, async () => {
//     const count = await orgsPage.getOrganizationsElements().count();
//     if (count) {
//       await expect(orgsPage.getOrganizationsElements().first().getText()).toContain('ИНН');
//     }
//     // if (!count) {
//     //   await expect(orgsPage.getEmptyOrganizationsElement().isPresent()).toBe(true);
//     // }
//   });

//   afterAll(async () => {
//     await logout();
//   });

// });
