const fs = require('fs');
const authData = fs.readFileSync('./proxy-remote-assets/auth.json').toString();
const cartData = fs.readFileSync('./proxy-remote-assets/shopping-carts.json').toString();
const categoriesData = fs.readFileSync('./proxy-remote-assets/product-offers-categories.json').toString();
const productOffersData = fs.readFileSync('./proxy-remote-assets/product-offers.json').toString();
const productOffersById = fs.readFileSync('./proxy-remote-assets/product-offers__92320f4c-0fb7-4d45-a449-f167bc1305b4.json').toString();
const locations = fs.readFileSync('./proxy-remote-assets/locations__search.json').toString();
const addresses = fs.readFileSync('./proxy-remote-assets/locations__search-address.json').toString();
const mainRegions = fs.readFileSync('./proxy-remote-assets/locations__main-regions.json').toString();
const userOrganizations1 = fs.readFileSync('./proxy-remote-assets/organizations__user-organizations-1.json').toString();
const userOrganizations2 = fs.readFileSync('./proxy-remote-assets/organizations__user-organizations-2.json').toString();
const organizationsById = fs.readFileSync('./proxy-remote-assets/organizations__01f85410-45dc-4f20-902b-f6aba5be3497.json').toString();
const organizationsProfilesById = fs
  .readFileSync('./proxy-remote-assets/organizations-profiles__01f85410-45dc-4f20-902b-f6aba5be3497.json')
  .toString();
const organizationAdmins = fs.readFileSync('./proxy-remote-assets/organizations__admins__12345.json').toString();
const organizationByLegalId = fs.readFileSync('./proxy-remote-assets/organizations__by-legal-id__12345.json').toString();
const organizationUsers = fs.readFileSync('./proxy-remote-assets/organizations__id__users.json').toString();
const ownParticipationRequests = fs.readFileSync('./proxy-remote-assets/organizations__own-participation-requests.json').toString();
const participationRequests = fs.readFileSync('./proxy-remote-assets/organizations__participation-requests.json').toString();
const suggestions = fs.readFileSync('./proxy-remote-assets/suggestions.json').toString();
const suppliers = fs.readFileSync('./proxy-remote-assets/suppliers.json').toString();
const tradeOffersById = fs.readFileSync('./proxy-remote-assets/trade-offers__f524af2c-47a6-4f9b-86ab-df185f2a2767.json').toString();
const tradeOffers = fs.readFileSync('./proxy-remote-assets/trade-offers__search.json').toString();
const accounts = fs.readFileSync('./proxy-remote-assets/accounts.json').toString();
const orders = fs.readFileSync('./proxy-remote-assets/orders.json').toString();
const accountsId = fs.readFileSync('./proxy-remote-assets/accounts__ID.json').toString();
const ordersId = fs.readFileSync('./proxy-remote-assets/orders__ID.json').toString();
const accessKey = fs.readFileSync('./proxy-remote-assets/access-keys__obtain.json').toString();
const accessKeys = fs.readFileSync('./proxy-remote-assets/organizations__access-keys.json').toString();

const PROXY_CONFIG = [
  {
    context: '/proxifier',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    methods: ['POST', 'GET', 'DELETE', 'PUT'],
    bypass: (req, res, proxyOptions) => {
      const pathsObject = {
        '/proxifier/auth': /^\/proxifier\/auth\/?$/i,
        '/proxifier/auth/revoke': /^\/proxifier\/auth\/revoke\/?$/i,
        '/proxifier/categories': /^\/proxifier\/categories\/?$/i,
        '/proxifier/product-offers/popular': /^\/proxifier\/product-offers\/popular\/?$/i,
        '/proxifier/product-offers': /^\/proxifier\/product-offers\/?$/i,
        '/proxifier/product-offers/:id': /^\/proxifier\/product-offers\/(?:([^\/]+?))\/?$/i,
        '/proxifier/locations/search': /^\/proxifier\/locations\/search\/?$/i,
        '/proxifier/locations/search-address': /^\/proxifier\/locations\/search-address\/?$/i,
        '/proxifier/locations/main-regions': /^\/proxifier\/locations\/main-regions\/?$/i,
        '/proxifier/organizations': /^\/proxifier\/organizations\/?$/i,
        '/proxifier/organizations/:id': /^\/proxifier\/organizations\/(?:([^\/]+?))\/?$/i,
        '/proxifier/organizations/:id/contact': /^\/proxifier\/organizations\/(?:([^\/]+?))\/contact\/?$/i,
        '/proxifier/organizations/:id/users': /^\/proxifier\/organizations\/(?:([^\/]+?))\/users\/?$/i,
        '/proxifier/organizations/:id/users/:userId': /^\/proxifier\/organizations\/(?:([^\/]+?))\/users\/(?:([^\/]+?))\/?$/i,
        '/proxifier/organizations/profiles/:id': /^\/proxifier\/organizations\/profiles\/(?:([^\/]+?))\/?$/i,
        '/proxifier/organizations/admins/:id': /^\/proxifier\/organizations\/admins\/(?:([^\/]+?))\/?$/i,
        '/proxifier/organizations/user-organizations': /^\/proxifier\/organizations\/user-organizations\/?$/i,
        '/proxifier/organizations/by-legal-id/:id': /^\/proxifier\/organizations\/by-legal-id\/(?:([^\/]+?))\/?$/i,
        '/proxifier/organizations/own-participation-requests': /^\/proxifier\/organizations\/own-participation-requests\/?$/i,
        '/proxifier/organizations/participation-requests': /^\/proxifier\/organizations\/participation-requests\/?$/i,
        '/proxifier/organizations/participation-requests/:id/accept': /^\/proxifier\/organizations\/participation-requests\/(?:([^\/]+?))\/accept\/?$/i,
        '/proxifier/organizations/participation-requests/:id/reject': /^\/proxifier\/organizations\/participation-requests\/(?:([^\/]+?))\/reject\/?$/i,
        '/proxifier/organizations/access-keys/:id': /^\/proxifier\/organizations\/access-keys\/(?:([^\/]+?))\/?$/i,
        '/proxifier/organizations/access-keys/obtain': /^\/proxifier\/organizations\/access-keys\/obtain\/?$/i,
        '/proxifier/organizations/access-keys': /^\/proxifier\/organizations\/access-keys\/?$/i,
        '/proxifier/suggestions': /^\/proxifier\/suggestions\/?$/i,
        '/proxifier/suppliers': /^\/proxifier\/suppliers\/?$/i,
        '/proxifier/trade-offers/:id': /^\/proxifier\/trade-offers\/(?:([^\/]+?))\/?$/i,
        '/proxifier/trade-offers/search': /^\/proxifier\/trade-offers\/search\/?$/i,
        '/proxifier/trade-offers/find/:id': /^\/proxifier\/trade-offers\/find\/(?:([^\/]+?))\/?$/i,
        '/proxifier/shopping-carts': /^\/proxifier\/shopping-carts\/?$/i,
        '/proxifier/shopping-carts/:id': /^\/proxifier\/shopping-carts\/(?:([^\/]+?))\/?$/i,
        '/proxifier/shopping-carts/:id/items': /^\/proxifier\/shopping-carts\/(?:([^\/]+?))\/items\/?$/i,
        '/proxifier/shopping-carts/:id/items/:itemId': /^\/proxifier\/shopping-carts\/(?:([^\/]+?))\/items\/(?:([^\/]+?))\/?$/i,
        '/proxifier/shopping-carts/:id/items/:itemId/quantity': /^\/proxifier\/shopping-carts\/(?:([^\/]+?))\/items\/(?:([^\/]+?))\/quantity\/?$/i,
        '/proxifier/shopping-carts/:id/order/:orderId': /^\/proxifier\/shopping-carts\/(?:([^\/]+?))\/order\/(?:([^\/]+?))\/?$/i,
        '/proxifier/edi/orders': /^\/proxifier\/edi\/orders\/?$/i,
        '/proxifier/edi/accounts': /^\/proxifier\/edi\/accounts\/?$/i,
        '/proxifier/edi/orders/:id': /^\/proxifier\/edi\/orders\/(?:([^\/]+?))\/?$/i,
        '/proxifier/edi/accounts/:id': /^\/proxifier\/edi\/accounts\/(?:([^\/]+?))\/?$/i,
      };

      if (req.method === 'POST' && pathsObject['/proxifier/auth'].test(req.originalUrl.split('?')[0])) {
        res.status(201);
        res.end(authData);
        return true;
      }

      if (req.method === 'POST' && pathsObject['/proxifier/auth/revoke'].test(req.originalUrl.split('?')[0])) {
        res.status(204);
        res.end('');
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/categories'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(categoriesData);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/product-offers/popular'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(productOffersData);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/product-offers'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(productOffersData);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/product-offers/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(productOffersById);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/locations/search'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(locations);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/locations/search-address'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(addresses);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/locations/main-regions'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(mainRegions);
        return true;
      }

      if (req.method === 'POST' && pathsObject['/proxifier/organizations'].test(req.originalUrl.split('?')[0])) {
        res.status(201);
        res.end('');
        return true;
      }

      if (
        req.method === 'GET' &&
        pathsObject['/proxifier/organizations/:id'].test(req.originalUrl.split('?')[0]) &&
        !req.originalUrl.split('?')[0].includes('user-organizations') &&
        !req.originalUrl.split('?')[0].includes('admins') &&
        !req.originalUrl.split('?')[0].includes('by-legal-id') &&
        !req.originalUrl.split('?')[0].includes('participation-requests') &&
        !req.originalUrl.split('?')[0].includes('own-participation-requests') &&
        !req.originalUrl.split('?')[0].includes('access-keys') &&
        !req.originalUrl.split('?')[0].includes('profiles') &&
        !req.originalUrl.split('?')[0].includes('contact') &&
        !req.originalUrl.split('?')[0].includes('users')
      ) {
        res.status(200);
        res.end(organizationsById);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/:id/users'].test(req.originalUrl.split('?')[0])) {
        res.status(201);
        res.end(organizationUsers);
        return true;
      }

      if (req.method === 'DELETE' && pathsObject['/proxifier/organizations/:id/users/:userId'].test(req.originalUrl.split('?')[0])) {
        res.status(201);
        res.end('');
        return true;
      }

      if (req.method === 'PATCH' && pathsObject['/proxifier/organizations/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(201);
        res.end('');
        return true;
      }

      if (req.method === 'PUT' && pathsObject['/proxifier/organizations/:id/contact'].test(req.originalUrl.split('?')[0])) {
        res.status(201);
        res.end('');
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/profiles/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(organizationsProfilesById);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/admins/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(Math.random() < 0.5 ? organizationAdmins : '[]');
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/by-legal-id/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(Math.random() < 0.5 ? organizationByLegalId : '');
        return true;
      }

      if (req.method === 'POST' && pathsObject['/proxifier/organizations/participation-requests'].test(req.originalUrl.split('?')[0])) {
        res.status(204);
        res.end('');
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/own-participation-requests'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(ownParticipationRequests);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/participation-requests'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(participationRequests);
        return true;
      }

      if (
        req.method === 'PUT' &&
        pathsObject['/proxifier/organizations/participation-requests/:id/accept'].test(req.originalUrl.split('?')[0])
      ) {
        res.status(200);
        res.end('');
        return true;
      }

      if (
        req.method === 'PUT' &&
        pathsObject['/proxifier/organizations/participation-requests/:id/reject'].test(req.originalUrl.split('?')[0])
      ) {
        res.status(200);
        res.end('');
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/user-organizations'].test(req.originalUrl.split('?')[0])) {
        const randomNum = Math.floor(Math.random() * 2) + 1;
        res.status(200);
        res.end(randomNum < 2 ? userOrganizations1 : userOrganizations2);
        return true;
      }

      if (req.method === 'POST' && pathsObject['/proxifier/organizations/access-keys/obtain'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(accessKey);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/access-keys'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(accessKeys);
        return true;
      }

      if (req.method === 'DELETE' && pathsObject['/proxifier/organizations/access-keys/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(201);
        res.end('');
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/suggestions'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(suggestions);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/suppliers'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(suppliers);
        return true;
      }

      if (
        req.method === 'GET' &&
        pathsObject['/proxifier/trade-offers/:id'].test(req.originalUrl.split('?')[0]) &&
        !req.originalUrl.split('?')[0].includes('search')
      ) {
        res.status(200);
        res.end(tradeOffersById);
        return true;
      }

      if (
        req.method === 'GET' &&
        pathsObject['/proxifier/trade-offers/find/:id'].test(req.originalUrl.split('?')[0]) &&
        !req.originalUrl.split('?')[0].includes('search')
      ) {
        res.status(200);
        res.end(tradeOffersById);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/trade-offers/search'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(tradeOffers);
        return true;
      }

      if (req.method === 'POST' && pathsObject['/proxifier/shopping-carts'].test(req.originalUrl.split('?')[0])) {
        res.set('Location', 'proxifier/shopping-carts/777888999');
        res.status(201);
        res.end(null);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/shopping-carts/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(Math.random() < 0.5 ? cartData : '{"content":[]}');
        return true;
      }

      if (req.method === 'DELETE' && pathsObject['/proxifier/shopping-carts/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(204);
        res.end(null);
        return true;
      }

      if (req.method === 'POST' && pathsObject['/proxifier/shopping-carts/:id/items'].test(req.originalUrl.split('?')[0])) {
        res.set('Location', 'proxifier/shopping-carts/777888999/items/9999999');
        res.status(201);
        res.end(null);
        return true;
      }

      if (req.method === 'DELETE' && pathsObject['/proxifier/shopping-carts/:id/items/:itemId'].test(req.originalUrl.split('?')[0])) {
        res.status(204);
        res.end(null);
        return true;
      }

      if (req.method === 'PUT' && pathsObject['/proxifier/shopping-carts/:id/items/:itemId/quantity'].test(req.originalUrl.split('?')[0])) {
        res.status(204);
        res.end(null);
        return true;
      }

      if (req.method === 'POST' && pathsObject['/proxifier/shopping-carts/:id/order/:orderId'].test(req.originalUrl.split('?')[0])) {
        res.set('Location', 'https://todo-api.1cbn.ru/edi/v1/documents/33333');
        res.status(201);
        res.end(null);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/edi/orders'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(orders);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/edi/accounts'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(accounts);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/edi/orders/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(ordersId);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/edi/accounts/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(accountsId);
        return true;
      }
    },
  },
];

module.exports = PROXY_CONFIG;
