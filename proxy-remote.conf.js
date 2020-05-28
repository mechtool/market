const PROXY_CONFIG = [
  {
    context: ["/proxifier"],
    target: "https://localhost:4200/assets/json",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: (path, req) => {
      console.log(path);
      if (path.includes("/proxifier/categories")) {
        return "product-offers-categories.json";
      }
      if (path.includes("/proxifier/product-offers/")) {
        return "product-offers__92320f4c-0fb7-4d45-a449-f167bc1305b4.json";
      }
      if (path.includes("/proxifier/product-offers")) {
        return "product-offers.json";
      }
      if (path.includes("/proxifier/locations/search")) {
        return "locations__search.json";
      }
      if (path.includes("/proxifier/organizations/user-organizations")) {
        return "organizations__user-organizations.json";
      }
      if (path.includes("/proxifier/suggestions")) {
        return "suggestions.json";
      }
      if (path.includes("/proxifier/suppliers")) {
        return "suppliers.json";
      }
      if (path.includes("/proxifier/trade-offers/")) {
        return "trade-offers__f524af2c-47a6-4f9b-86ab-df185f2a2767.json";
      }
    },
  },
];

module.exports = PROXY_CONFIG;
