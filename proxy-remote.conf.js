const fs = require('fs');
const authData = fs.readFileSync('./src/assets/json/auth.json').toString();
const cartData = fs.readFileSync('./src/assets/json/shopping-carts.json').toString();
const categoriesData = fs.readFileSync('./src/assets/json/product-offers-categories.json').toString();
const productOffersData = fs.readFileSync('./src/assets/json/product-offers.json').toString();
const productOffersById = fs.readFileSync('./src/assets/json/product-offers__92320f4c-0fb7-4d45-a449-f167bc1305b4.json').toString();
const locations = fs.readFileSync('./src/assets/json/locations__search.json').toString();
const userOrganizations1 = fs.readFileSync('./src/assets/json/organizations__user-organizations-1.json').toString();
const userOrganizations2 = fs.readFileSync('./src/assets/json/organizations__user-organizations-2.json').toString();
const organizationsById = fs.readFileSync('./src/assets/json/organizations__01f85410-45dc-4f20-902b-f6aba5be3497.json').toString();
const suggestions = fs.readFileSync('./src/assets/json/suggestions.json').toString();
const suppliers = fs.readFileSync('./src/assets/json/suppliers.json').toString();
const tradeOffersById = fs.readFileSync('./src/assets/json/trade-offers__f524af2c-47a6-4f9b-86ab-df185f2a2767.json').toString();
const tradeOffers = fs.readFileSync('./src/assets/json/trade-offers__search.json').toString();


const PROXY_CONFIG = [
  {
    context: '/proxifier',
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    methods: ['POST', 'GET', 'DELETE', 'PUT'],
    bypass: (req, res, proxyOptions) => {

      const pathsObject = {
        '/proxifier/auth': /^\/proxifier\/auth\/?$/i,
        '/proxifier/categories': /^\/proxifier\/categories\/?$/i,
        '/proxifier/product-offers/popular': /^\/proxifier\/product-offers\/popular\/?$/i,
        '/proxifier/product-offers': /^\/proxifier\/product-offers\/?$/i,
        '/proxifier/product-offers/:id': /^\/proxifier\/product-offers\/(?:([^\/]+?))\/?$/i,
        '/proxifier/locations/search': /^\/proxifier\/locations\/search\/?$/i,
        '/proxifier/organizations': /^\/proxifier\/organizations\/?$/i,
        '/proxifier/organizations/:id': /^\/proxifier\/organizations\/(?:([^\/]+?))\/?$/i,
        '/proxifier/organizations/user-organizations': /^\/proxifier\/organizations\/user-organizations\/?$/i,
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
      };

      if (req.method === 'POST' && pathsObject['/proxifier/auth'].test(req.originalUrl.split('?')[0])) {
        res.status(201);
        res.end(authData);
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

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/:id'].test(req.originalUrl.split('?')[0]) && !req.originalUrl.split('?')[0].includes('user-organizations')) {
        res.status(200);
        res.end(organizationsById);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/organizations/user-organizations'].test(req.originalUrl.split('?')[0])) {
        const randomNum = Math.floor(Math.random() * 2) + 1;
        res.status(200);
        res.end(randomNum < 2 ? userOrganizations1 : userOrganizations2);
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

      if (req.method === 'GET' && pathsObject['/proxifier/trade-offers/:id'].test(req.originalUrl.split('?')[0]) && !req.originalUrl.split('?')[0].includes('search')) {
        res.status(200);
        res.end(tradeOffersById);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/trade-offers/find/:id'].test(req.originalUrl.split('?')[0]) && !req.originalUrl.split('?')[0].includes('search')) {
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
        res.set('Location', 'https://my.1cbn.ru:4200/proxifier/shopping-carts/777888999');
        res.status(201);
        res.end(null);
        return true;
      }

      if (req.method === 'GET' && pathsObject['/proxifier/shopping-carts/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(200);
        res.end(cartData);
        return true;
      }

      if (req.method === 'DELETE' && pathsObject['/proxifier/shopping-carts/:id'].test(req.originalUrl.split('?')[0])) {
        res.status(204);
        res.end(null);
        return true;
      }

      if (req.method === 'POST' && pathsObject['/proxifier/shopping-carts/:id/items'].test(req.originalUrl.split('?')[0])) {
        res.set('Location', 'https://my.1cbn.ru:4200/proxifier/shopping-carts/777888999/items/9999999');
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

    },
  },

];

module.exports = PROXY_CONFIG;
