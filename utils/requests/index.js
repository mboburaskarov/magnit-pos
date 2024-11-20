import { authRequest, authRequest2, fileUploadRequest, request, yandexMapsRequest } from '../axios'
import * as qs from 'qs'

export const requests = {
  logIn2: (data) => authRequest.post(`api/auth/sign-in-admin`, data),
  logIn: (data) => authRequest2.post(`v1/login`, data),
  getUserInfo: () => request.get(`api/auth/get-user-information`),

  //category
  getAllCategories: (filter) => request.get(`api/categories/parent-categories${qs.stringify(filter, { addQueryPrefix: true })}`),
  createCategory: (data) => request.post(`api/categories`, data),
  getAllCategoriesBuchet: (filter) => request.get(`api/categories${qs.stringify(filter, { addQueryPrefix: true })}`),
  createBillzCategory: (data) => request.post(`api/billz`, data),
  getCategoryBillz: (filter) => request.get(`api/billz/categories${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateCategory: ({ id, data }) => request.patch(`api/categories/${id}`, data),
  getSingleCategory: (id) => request.get(`api/categories/${id}`),
  deleteCategory: (id) => request.delete(`api/categories/${id}`),
  //hashtag
  getAllHashtags: (filter) => request.get(`api/hashtags${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllClients: (filter) => request.get(`api/users${qs.stringify(filter, { addQueryPrefix: true })}`),

  //orders
  getAllOrders: (filter) => request.get(`api/admin/orders${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAlltransactionsOrders: (filter) => request.get(`api/admin/orders/transactions${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleOrder: (id) => request.get(`api/admin/orders/${id}`),
  getSingleOrderHistory: (filter) => request.get(`api/admin/orders-status${qs.stringify(filter, { addQueryPrefix: true })}`),
  acceptOrder: (data) => request.post(`api/admin/orders/approve-by-admin`, data),
  finishOrder: (data) => request.post(`api/admin/orders/done`, data),
  cancelOrder: (data) => request.post(`api/admin/orders/rejected`, data),
  editOrder: (data) => request.patch(`api/admin/orders/${data?.orderId}`, data),
  reOrderCourier: (data) => request.post(`api/admin/orders/yandex-re-order`, data),
  createOrderNote: (data) => request.post(`api/admin/orders-notes`, data),
  cancelCourier: (data) => request.post(`api/yandex/cancel`, data),
  assigneOperator: (data) => request.post(`api/admin/orders/assign-to-moderator`, data),
  getOrderNote: (filter) => request.get(`api/admin/orders-notes${qs.stringify(filter, { addQueryPrefix: true })}`),
  deleteOrder: (data) => request.post(`api/admin/orders/cancelled`, data),
  rePay: (data) => request.post(`api/unipos/create`, data),
  //comments
  getAllComments: (filter) => request.get(`api/admin/comments${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateComment: ({ id, data }) => request.patch(`api/admin/comments/${id}`, data),
  deleteComment: (id) => request.delete(`api/admin/comments/${id}`),

  //products
  getAllProducts: (filter) => request.get(`api/admin/products${qs.stringify(filter, { addQueryPrefix: true })}`),
  createProduct: (data) => request.post(`api/admin/products`, data),
  getSingleProduct: (id) => request.get(`api/admin/products/${id}`),
  getSingleProductHistory: (filter) => request.get(`api/admin/products-status${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateProduct: ({ id, data }) => request.patch(`api/admin/products/${id}`, data),
  deleteProduct: (id) => request.delete(`api/admin/products/${id}`),
  rejectProduct: (data) => request.post(`api/admin/products/reject`, data),
  activateProduct: (id) => request.post(`api/admin/products/update-status-to-active`, { id }),
  changeProductStatus: (data) => request.post(`api/admin/products/update-status`, data),

  // couriers
  getAllCouriers: (filter) => request.get(`api/admin/couriers${qs.stringify(filter, { addQueryPrefix: true })}`),
  createCourier: (data) => request.post(`api/admin/couriers`, data),
  editCourier: ({ id, data }) => request.patch(`api/admin/couriers/${id}`, data),
  payCourierOrders: (data) => request.post(`api/admin/courier-transactions`, data),
  refreshCouriers: (filter) => request.get(`api/admin/couriers/refresh${qs.stringify(filter, { addQueryPrefix: true })}`),

  //shops
  getAllShops: (filter) => request.get(`api/admin/shops${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateShop: ({ id, data }) => request.patch(`api/admin/shops/${id}`, data),
  createShop: (data) => request.post(`api/admin/shops`, data),
  getSingleShop: (id) => request.get(`api/admin/shops/${id}`),
  getSingleShopHistory: (filter) => request.get(`api/admin/shop-logs${qs.stringify(filter, { addQueryPrefix: true })}`),
  deleteShop: (id) => request.delete(`api/admin/shops/${id}`),
  changeShopStatus: (data) => request.post(`api/admin/shops/change-status-by-admin`, data),

  //users
  getAllUsers: (filter) => request.get(`api/admin/users${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleUser: (id) => request.get(`api/admin/users/${id}`),
  updateUser: ({ id, data }) => request.patch(`api/admin/users/${id}`, data),
  deleteUser: (id) => request.delete(`api/admin/users/${id}`),

  //vendors
  getAllVendors: (filter) => request.get(`api/admin/vendors${qs.stringify(filter, { addQueryPrefix: true })}`),
  createVendor: (data) => request.post(`api/admin/vendors`, data),
  updateVendor: ({ id, data }) => request.patch(`api/admin/vendors/${id}`, data),
  getSingleVendor: (id) => request.get(`api/admin/vendors/${id}`),
  deleteVendor: (id) => request.delete(`api/admin/vendors/${id}`),

  //upload files
  imageUpload: (data) => fileUploadRequest.post('/upload', data),
  fileUpload: (data) => fileUploadRequest.post('/upload', data),

  //yandex
  findAddressFromYandex: (filter) => yandexMapsRequest.get(qs.stringify(filter, { addQueryPrefix: true })),
  getYandexDeliveryInfo: (id) => request.post(`api/yandex/check-price`, { orderId: id }),
  getYandexCourirerInfo: ({ claimId, service }) => request.post(`api/deliveries/driver-voiceforwarding`, { claimId, service }),
  getYandexTracking: ({ claimId, service }) => request.post(`api/deliveries/performer-position`, { claimId, service }),

  //reports
  getAccountingReport: (filter) => request.get(`api/admin/contracts/get-report${qs.stringify(filter, { addQueryPrefix: true })}`),
  getTransactionsReport: (filter) => request.get(`api/admin/orders-report/monthly-report${qs.stringify(filter, { addQueryPrefix: true })}`),
  getTransactionsReportExcel: (filter) => request.post(`api/admin/orders-report/monthly-report-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  getNonPaidAccountingReport: (filter) => request.get(`api/admin/contracts/company-transaction${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAccountingReportExcel: (data) => request.post(`api/admin/contracts/get-excel`, data),
  getNonPaidAccountingReportExcel: (data) => request.post(`api/admin/contracts/company-transaction-excel`, data),
  makeTransactionPaid: (data) => request.post(`api/admin/orders/paid-to-shop`, data),
  makeTransactionPaidWithID: (data) => request.post(`api/admin/orders/paid-many-to-shop`, data),

  //reports users
  getUsersMainInfo: (filter) => request.get(`api/user-report/users-count${qs.stringify(filter, { addQueryPrefix: true })}`),
  getUsersChartInfo: (filter) => request.get(`api/user-report/users-chart${qs.stringify(filter, { addQueryPrefix: true })}`),
  getUsersMapInfo: (filter) => request.get(`api/user-report/users-registration-chart${qs.stringify(filter, { addQueryPrefix: true })}`),
  getUserList: (filter) => request.get(`api/user-report/users-list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //reports referals
  getReferalsMainInfo: (filter) => request.get(`api/referals/main-info${qs.stringify(filter, { addQueryPrefix: true })}`),
  getReferalsTableData: (filter) => request.get(`api/referals${qs.stringify(filter, { addQueryPrefix: true })}`),

  //reports delivery
  getDeliveryMainInfo: (filter) => request.get(`api/deliveries/main-info${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDeliveryChartInfo: (filter) => request.get(`api/deliveries/chart${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDeliveryMapInfo: (filter) => request.get(`api/deliveries/map${qs.stringify(filter, { addQueryPrefix: true })}`),

  //dashboard
  getDashboardMainInfo: (filter) => request.get(`api/dashboard/main-info${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDashboardChartInfo: (filter) => request.get(`api/dashboard/chart${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDashboardTopSales: (filter) => request.get(`api/dashboard/top-shops${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDashboardTopClients: (filter) => request.get(`api/dashboard/top-clients${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDashboardTopProducts: (filter) => request.get(`api/dashboard/top-products${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDashboardTopCategories: (filter) => request.get(`api/dashboard/top-categories${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDashboardVendorMap: (filter) => request.get(`api/dashboard/shops-location${qs.stringify(filter, { addQueryPrefix: true })}`),

  // notifications
  getAllNotifications: (filter) => request.get(`api/notifications/notifications-by-group${qs.stringify(filter, { addQueryPrefix: true })}`),
  createNotification: (data) => request.post('api/notifications/create', data),
  // banners
  getAllBanners: (filter) => request.get(`api/banners${qs.stringify(filter, { addQueryPrefix: true })}`),
  createBanner: (data) => request.post('api/banners', data),
  deleteBanner: (id) => request.delete(`api/banners/${id}`),

  //regions
  getAllRegions: (filter) => request.get(`api/regions${qs.stringify(filter, { addQueryPrefix: true })}`),

  // hashtags
  deleteHashtag: (id) => request.delete(`api/hashtags/${id}`),
  createHashtag: (data) => request.post('api/hashtags', data),

  // roles
  getAllRoles: (filter) => request.get(`api/roles${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleRole: (id) => request.get(`api/roles/${id}`),
  createRole: (data) => request.post('api/roles', data),
  deleteRole: (id) => request.delete(`api/roles/${id}`),
  updateRole: ({ id, data }) => request.patch(`api/roles/${id}`, data),

  // actions
  getAllActions: () => request.get(`api/actions`),
  getSingleAction: (id) => request.get(`api/actions/${id}`),
  createActionInsertMany: (data) => request.post(`api/actions/insert-many`, data),
  createAction: (data) => request.post(`api/actions`, data),
  deleteActions: (id) => request.delete(`api/actions/${id}`),
  updateAction: ({ id, data }) => request.patch(`api/actions/${id}`, data),

  // role-actions
  createRoleActionInsertMany: (data) => request.post('api/role-actions/insert-many', data),
  getSingleRoleActions: (filter) => request.get(`api/role-actions${qs.stringify(filter, { addQueryPrefix: true })}`),
  updaterRoleActionMany: (data) => request.post('api/role-actions/update-many', data),

  // permission
  getAllPermissions: (filter) => request.get(`api/permissions${qs.stringify(filter, { addQueryPrefix: true })}`),

  // admins
  getAllAdmins: (filter) => request.get(`api/admins${qs.stringify(filter, { addQueryPrefix: true })}`),
  deleteAdmin: (id) => request.delete(`api/admins/${id}`),
  createAdmin: (data) => request.post(`api/admins`, data),
  getSingleAdmin: (id) => request.get(`api/admins/${id}`),
  updateAdmin: ({ id, data }) => request.patch(`api/admins/${id}`, data),

  // app-report
  getAppReportByCount: (filter) => request.get(`api/app-metrics/metrics-by-count${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDownloadActionChart: (filter) => request.get(`api/app-metrics/download-action${qs.stringify(filter, { addQueryPrefix: true })}`),
  getUsersByDeviceModel: (filter) => request.get(`api/app-metrics/users-by-device-model${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAppEvents: (filter) => request.get(`api/app-metrics/events-count${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAppRequestCount: (filter) => request.get(`api/app-metrics/api-requests-count${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAppDeletedUsers: (filter) => request.get(`api/app-metrics/deleted-action${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAppVersionHistory: (filter) => request.get(`api/app-metrics/version-history${qs.stringify(filter, { addQueryPrefix: true })}`),

  // shop-problems
  createShopProblem: (data) => request.post(`api/admin/shops-problems`, data),
  getShopProblems: (filter) => request.get(`api/admin/shops-problems${qs.stringify(filter, { addQueryPrefix: true })}`),

  // noor
  getNoorToken: () =>
    request.post(`/api/noor/signin`, undefined, {
      headers: {
        Authorization: localStorage.getItem('noorToken'),
      },
    }),
}
