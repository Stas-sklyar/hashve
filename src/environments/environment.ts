// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apihost: 'http://188.120.225.152:3000',
  apihost: "https://backend.hashve.co.il",
  // apihost: 'http://localhost:3000',
  config: "/api/v1/config",
  homeEndpoint: "/api/v1/content/homepage",
  citySearchEndpoint: "/api/v1/content/city-search",
  userEndpoint: "/api/v1/user",
  cityEndpoint: "/api/v1/city",
  cityWithoutLogin: "/api/v1/content/cities",
  categoryWithoutLogin: "/api/v1/content/category",
  countryEndpoint: "/api/v1/country",
  regionEndpoint: "/api/v1/region",
  itemEndpoint: "/api/v1/item",
  categoryEndpoint: "/api/v1/category",
  storeEndpoint: "/api/v1/store",
  packageEndpoint: "/api/v1/package",
  eventEndpoint: "/api/v1/event",
  uploadFile: "/api/v1/upload",
  saveOfferEndPoint: "/api/v1/content/product",
  getOfferEndPoint: "/api/v1/content/product",
  saveOrderEndPoint: "/api/v1/content/order",
  orderEndpoint: "/api/v1/content/order",
  saveRateEndpoint: "/api/v1/content/save-rate",
  cheapestDeliveryStore: "/api/v1/content/cheapest-delivery-store",
  bouquetsRates: "/api/v1/content/bouquets-rates",
  storeRates: "/api/v1/content/store-rates",
  regions: "/api/v1/content/regions",
  shopList: "/api/v1/content/shop-list",
  shopItem: "/api/v1/content/store",
  shopById: "/api/v1/content/store/byId",
  items: "/api/v1/content/items",
  itemInfo: "/api/v1/content/get-item-info",
  ratePoint: "/api/v1/content/rate",
  articleList: "/api/v1/content/article?showInList=true",
  articleDetail: "/api/v1/content/article?name=",
  articleLast: "/api/v1/content/article?last=3",
  articleSupport: "/api/v1/content/article?articleType=",
  addNewStore: "/api/v1/content/article?articleType=",
  wishList: "/api/v1/content/wishlist",
  busket: "/api/v1/content/get-card",
  storeCall: "/api/v1/content/story-call",
  getOrderIdByOffer: "/api/v1/content/order-id-by-offer/",
  uploadCategory: "/category",
  uploadItem: "/item",
  uploadRegion: "/region",
  uploadStore: "/store",
  priceImproveTime: 180,
  hmr: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
