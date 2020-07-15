const PROXY_CONFIG = [
  {
    context: '/proxifier/auth',
    methods: ['POST'],
    bypass: (req, res, proxyOptions) => {
      if (req.originalUrl === '/proxifier/auth') {
        const obj = {
          "accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlZWRhODY4MS1iMzEwLTRhOTAtYTUwOC0yZTMzZjZmM2IxODkiLCJleHAiOjE1OTQ3MjMwNTUsInN1YiI6IjUxOTA2ZjA3LWE3MGMtNDU4NS05ZThkLWM4NTU3NGU5ZDUyZSIsImlhdCI6MTU5NDcyMjkzNSwiaXNzIjoiL2F1dGgvdG9rZW4vYnktaXRzLXNzby10aWNrZXQiLCJibi5zaWQiOiI5ZDIzNWQ3MS01ZjJiLTQyNmItYjZhMi00MWFiYzg4MmMxZGMiLCJibmV0Ijp7Imlhc2IiOm51bGwsIm9yZ3MiOm51bGwsInN1YnQiOiJ1c3IiLCJzc2lkIjoiOWQyMzVkNzEtNWYyYi00MjZiLWI2YTItNDFhYmM4ODJjMWRjIiwic3JscyI6bnVsbH0sIjFjLmxvZ2luLnVzZXJfaWQiOiI1MTkwNmYwNy1hNzBjLTQ1ODUtOWU4ZC1jODU1NzRlOWQ1MmUiLCJibi50dHlwIjoicHNuIn0.WmFt4G1mJ5AcucpZtfPvRk1aIEKOSHV-CpBtK4ShC4g",
          "refreshToken":"eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIyZDFiY2NhMi05M2Q4LTQ5NzgtYmY3Mi0yYzc1NTI4MzEzOWMiLCJleHAiOjE1OTQ3MzAxMzUsImlhdCI6MTU5NDcyMjkzNSwiYm4uc2lkIjoiOWQyMzVkNzEtNWYyYi00MjZiLWI2YTItNDFhYmM4ODJjMWRjIn0.jdBV0Fj5J3a2T2nYZSn48hGCvNVWN3N6fjxgwk4yKSGBLgbR-qAb0VH7q4tMfSM9-E-pEhF-XitrzBJUdQOybFG8Uq_pVqAK_RFYYDN7fsBv0BKmH1dJVToEDrE1MPAuXURACjIZUGQWjBu_chwjE24TcGBp1auSywaah9H7WwLplu84U7TLf8DJuda_gvK8wnHtulnlKyMvEdyRrEEa0HqdbvgCpB5pp1orPx1zMvZV0L3_jBB-Pmii4ireUZIRdy6DjkmhrjSy74KE_6wzbgxRlTIj-WjxbuYpd44CpWXSot15d3fjhvuxMHLFKSNbyFCILUScrilFuaLffC5r4Q",
          "accessTokenExpiration":119,
          "refreshTokenExpiration":7199,
          "userInfo":
            {
              "userId":"51906f07-a70c-4585-9e8d-c85574e9d52e",
              "login":"ivan-remotov",
              "fullName":"Ivan Remotov",
              "phone":"",
              "email":"remote@test1cbn.ru"
            }
        }
        res.end(JSON.stringify(obj));
        return true;
      }
    }
  },
  {
    context: "/proxifier",
    target: "https://my.1cbn.ru:4200/assets/json",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: (path, req) => {
      console.log(path);
      if (path.includes("/proxifier/categories")) {
        return "product-offers-categories.json";
      }
      if (path.includes("/proxifier/product-offers/popular")) {
        return "product-offers.json";
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
        const randomNum = Math.floor(Math.random() * 2) + 1;
        return `organizations__user-organizations-${randomNum}.json`;
      }
      if (path.includes("/proxifier/organizations/")) {
        return "organizations__01f85410-45dc-4f20-902b-f6aba5be3497.json";
      }
      if (path.includes("/proxifier/suggestions")) {
        return "suggestions.json";
      }
      if (path.includes("/proxifier/suppliers")) {
        return "suppliers.json";
      }
      if (path.includes("/proxifier/trade-offers/search")) {
        return "trade-offers__search.json";
      }
      if (path.includes("/proxifier/trade-offers/")) {
        return "trade-offers__f524af2c-47a6-4f9b-86ab-df185f2a2767.json";
      }
    },
  }
];

module.exports = PROXY_CONFIG;

// {
//   context: ['/proxifier/auth'],
//   methods: ['POST'],
//   // target: 'http://my.1cbn.ru:4200',
//   pathRewrite: {
//     "^/proxifier/auth": ""
//   },
//   bypass: function (req, res, proxyOptions) {
    // const obj = {
    //   "accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlZWRhODY4MS1iMzEwLTRhOTAtYTUwOC0yZTMzZjZmM2IxODkiLCJleHAiOjE1OTQ3MjMwNTUsInN1YiI6IjUxOTA2ZjA3LWE3MGMtNDU4NS05ZThkLWM4NTU3NGU5ZDUyZSIsImlhdCI6MTU5NDcyMjkzNSwiaXNzIjoiL2F1dGgvdG9rZW4vYnktaXRzLXNzby10aWNrZXQiLCJibi5zaWQiOiI5ZDIzNWQ3MS01ZjJiLTQyNmItYjZhMi00MWFiYzg4MmMxZGMiLCJibmV0Ijp7Imlhc2IiOm51bGwsIm9yZ3MiOm51bGwsInN1YnQiOiJ1c3IiLCJzc2lkIjoiOWQyMzVkNzEtNWYyYi00MjZiLWI2YTItNDFhYmM4ODJjMWRjIiwic3JscyI6bnVsbH0sIjFjLmxvZ2luLnVzZXJfaWQiOiI1MTkwNmYwNy1hNzBjLTQ1ODUtOWU4ZC1jODU1NzRlOWQ1MmUiLCJibi50dHlwIjoicHNuIn0.WmFt4G1mJ5AcucpZtfPvRk1aIEKOSHV-CpBtK4ShC4g",
    //   "refreshToken":"eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIyZDFiY2NhMi05M2Q4LTQ5NzgtYmY3Mi0yYzc1NTI4MzEzOWMiLCJleHAiOjE1OTQ3MzAxMzUsImlhdCI6MTU5NDcyMjkzNSwiYm4uc2lkIjoiOWQyMzVkNzEtNWYyYi00MjZiLWI2YTItNDFhYmM4ODJjMWRjIn0.jdBV0Fj5J3a2T2nYZSn48hGCvNVWN3N6fjxgwk4yKSGBLgbR-qAb0VH7q4tMfSM9-E-pEhF-XitrzBJUdQOybFG8Uq_pVqAK_RFYYDN7fsBv0BKmH1dJVToEDrE1MPAuXURACjIZUGQWjBu_chwjE24TcGBp1auSywaah9H7WwLplu84U7TLf8DJuda_gvK8wnHtulnlKyMvEdyRrEEa0HqdbvgCpB5pp1orPx1zMvZV0L3_jBB-Pmii4ireUZIRdy6DjkmhrjSy74KE_6wzbgxRlTIj-WjxbuYpd44CpWXSot15d3fjhvuxMHLFKSNbyFCILUScrilFuaLffC5r4Q",
    //   "accessTokenExpiration":119,
    //   "refreshTokenExpiration":7199,
    //   "userInfo":
    //     {
    //       "userId":"51906f07-a70c-4585-9e8d-c85574e9d52e",
    //       "login":"ivan-remotov",
    //       "fullName":"Ivan Remotov",
    //       "phone":"",
    //       "email":"remote@test1cbn.ru"
    //     }
    // }
    // res.end(JSON.stringify(obj));
//     return true;
//   }
// },
