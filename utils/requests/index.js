import { get } from 'lodash'
import { authRequest, fileUploadRequest, request, yandexMapsRequest } from '../axios'
import * as qs from 'qs'

export const requests = {
  logIn: (data) => authRequest.post(`v1/login`, data),
  getUserInfo: (id) => request.get(`v1/employee/info`),
  //payment types
  getPaymentTypesList: (filter) => request.get(`v1/payment-type/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  addToOrderPayment: (data) => request.post(`v1/sale/final`, data),
  createProducer: (data) => request.post(`v1/producer`, data),
  createShelf: (data) => request.post(`v1/shelf`, data),
  getShelf: (filter) => request.get(`v1/shelf/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getProducer: (filter) => request.get(`v1/producer/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  createShift: (data) => request.post(`v1/shift`, data),
  checkSaleExist: (store_id) => request.get(`v1/cash_box/check?store_id=${store_id}`),
  changeEmployeeInfo: (data) => request.put(`v1/employee/info`, data),
  //category
  finishImportChecking: (id) => request.patch(`v1/import-detail/accept-some/${id}`),

  // categoryGetAll
  createAutoOrder: (data) => request.post(`v1/auto-order`, data),
  finalAutoOrder: (id) => request.post(`v1/auto-order/send/${id}`),
  autoOrderChangeQuantity: ({ id, ...adjusted_order_quantity }) => request.put(`v1/auto-order-detail/change-quantity/${id}`, { ...adjusted_order_quantity }),
  getAutoOrderDetailList: (filter) => request.get(`v1/auto-order-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAutoOrderList: (filter) => request.get(`v1/auto-order/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllCategories: (filter) => request.get(`v1/category/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getCategory: (id) => request.get(`v1/category/${id}`),
  getAllImports: (filter) => request.get(`v1/import/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getImportDetails: (filter) => request.get(`v1/import-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  createCategory: (data) => request.post(`v1/category`, data),
  getAllCategoriesBuchet: (filter) => request.get(`api/categories${qs.stringify(filter, { addQueryPrefix: true })}`),
  createBillzCategory: (data) => request.post(`api/billz`, data),
  getCategoryBillz: (filter) => request.get(`api/billz/categories${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateCategory: ({ id, data }) => request.put(`v1/category/${id}`, data),
  getSingleCategory: (id) => request.get(`api/categories/${id}`),
  deleteCategory: (id) => request.delete(`api/categories/${id}`),
  //hashtag
  getAllProducer: (filter) => request.get(`v1/product/producer${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllClients: (filter) => request.get(`api/users${qs.stringify(filter, { addQueryPrefix: true })}`),
  //customers
  createCustomer: (data) => request.post(`v1/customer`, data),

  getAllCustomers: (filter) => request.get(`v1/customer/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleCustomers: (id) => request.get(`v1/customer/${id}`),
  //barcode
  generateBarcode: () => request.post(`v1/product/generate-barcode`),
  //draft
  getDarftList: (filter) => request.get(`v1/draft/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDarftChildList: (id) => request.get(`v1/draft/${id}`),
  getDarftById: (id) => request.get(`v1/draft/list${id})}`),
  createDraft: (data) => request.post(`v1/draft`, data),
  deleteDraft: (id) => request.delete(`v1/draft/${id}`),
  completeDraft: (data) => request.put(`v1/draft/complete/${data}`),
  //orders
  getSaleDetails: (id) => request.get(`v1/sale/${id}`),
  getAllOrders: (filter) => request.get(`api/admin/orders${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAlltransactionsOrders: (filter) => request.get(`api/admin/orders/transactions${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleOrder: (id) => request.get(`api/admin/orders/${id}`),
  getSingleOrderHistory: (filter) => request.get(`api/admin/orders-status${qs.stringify(filter, { addQueryPrefix: true })}`),
  acceptOrder: (data) => request.post(`api/admin/orders/approve-by-admin`, data),
  finishSaleWithoutAppPaymentType: (data) => request.post(`v1/sale/final`, data),
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
  changePassword: (data) => request.put(`v1/employee/reset-password`, data),
  getAllComments: (filter) => request.get(`api/admin/comments${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateComment: ({ id, data }) => request.patch(`api/admin/comments/${id}`, data),
  deleteComment: (id) => request.delete(`api/admin/comments/${id}`),
  //discount
  changeDiscountValue: ({ id, body }) => request.put(`v1/cart_item/sale/${id}`, body),
  getCashBoxDetaildWithSaleId: (id) => request.get(`v1/sale/${id}`),
  //store
  getAllStores: (filter) => request.get(`v1/store/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllSimilarStoreProducts: (id) => request.get(`v1/product/similar/${id}`),
  getStoreProductByBarcode: (data) => request.post(`v1/product/store/barcode`, data),
  changeCartItemQuantity: ({ id, data }) => request.put(`v1/cart_item/${id}`, data),
  deleteStore: (id) => request.delete(`v1/store/${id}`),

  getAllCashBoxList: (filter) => request.get(`v1/cash_box/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  deleteCashBox: (ids) => request.delete(`v1/cash_box/soft-delete`, ids),

  // getAllVendors: (filter) => request.get(`v1/employee/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllUnits: (filter) => request.get(`v1/unit-types/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //products
  getAllProducts: (filter) => request.get(`v1/product/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllProductsStatusCount: (filter) => request.get(`v1/product/total-status-count${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllStoreProducts: (data, filter) => request.get(`v1/product/store/${get(data, 'id')}${qs.stringify(filter, { addQueryPrefix: true })}`),
  createProduct: (data) => request.post(`v1/product`, data),
  createCartItem: (data) => request.post(`v1/cart_item`, data),
  deleteCartItem: (id) => request.delete(`v1/cart_item/${id}`),
  deleteAll: (ids) => request.post(`v1/cart_item/multiple`, ids),
  getSingleProduct: (id) => request.get(`v1/product/${id}`),
  getSingleProductHistory: (filter, id) => request.get(`v1/product/import/${id}${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleProductRemainsHistory: (filter, id) => request.get(`v1/product/store-product/${id}${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateProduct: ({ id, data }) => request.put(`v1/product/${id}`, data),
  deleteProduct: (id) => request.delete(`v1/product?id=${id}`),
  activateProduct: (id) => request.post(`api/admin/products/update-status-to-active`, { id }),
  changeProductStatus: (data) => request.post(`api/admin/products/update-status`, data),

  loadWithoutChecking: (id) => request.patch(`v1/import-detail/accept-all/${id}`),
  sendScannedImport: (data) => request.patch(`v1/import-detail/add-scan`, data),
  sendScannedImportNumber: ({ id, scanned_count }) => request.put(`v1/import-detail/${id}`, { scanned_count }),
  // couriers
  getAllCouriers: (filter) => request.get(`api/admin/couriers${qs.stringify(filter, { addQueryPrefix: true })}`),
  createCourier: (data) => request.post(`api/admin/couriers`, data),
  editCourier: ({ id, data }) => request.patch(`api/admin/couriers/${id}`, data),
  payCourierOrders: (data) => request.post(`api/admin/courier-transactions`, data),
  refreshCouriers: (filter) => request.get(`api/admin/couriers/refresh${qs.stringify(filter, { addQueryPrefix: true })}`),
  //register cash
  createCashOperationBox: (data) => request.post(`v1/cash_box_operation`, data),
  createCashBox: (data) => request.post(`v1/cash_box`, data),
  updateCashBox: ({ id, data }) => request.put(`v1/cash_box/${id}`, data),
  getSingleCashBox: (id) => request.get(`v1/cash_box/${id}`),
  getSingleCashBoxForCreate: () => request.get(`v1/cash_box`),
  getPaymentTypeList: (filter) => request.get(`v1/payment-type/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getRegisterCashData: (cash_box_id) => cash_box_id && request.get(`v1/cash_box_operation/closed-info/${cash_box_id}`),
  getCashBoxOperationInfo: (cash_box_id) => cash_box_id && request.get(`v1/cash_box_operation/info/${cash_box_id}`),
  getRegisterCashList: (filter) => request.get(`v1/cash_box/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getCartItemList: (filter) => request.get(`v1/cart_item/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  //shops
  getAllSales: (filter) => request.get(`v1/sale/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  getCloseCashboxPaymentList: (cashBoxId) => request.get(`v1/sale-payment/list/close-cashbox/${cashBoxId}`),
  changeCloseBoxNetAmout: ({ id, data }) => request.put(`v1/sale-payment/amounts/${id}`, data),
  getCloseCashboxPaymentsInfo: (cashBoxId) => request.get(`v1/sale-payment/total-amount/${cashBoxId}`),
  closeCashBoxRegister: ({ id, data }) => request.put(`v1/cash_box_operation/close/${id}`, data),

  getAllShops: (filter) => request.get(`v1/store/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllRolesWithPermissions: (filter) => request.get(`v1/permission/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  // getAllRoles: (filter) => request.get(`v1/store/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  // getAllStores: (filter) => request.get(`v1/store/list${qs.stringify(filter, { addQueryPrefix: true })}`),
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
  getAllVendors: (filter) => request.get(`v1/employee/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  createVendor: (data) => request.post(`v1/employee`, data),

  updateVendor: ({ id, data }) => request.put(`v1/employee/${id}`, data),
  getSingleVendor: (id) => request.get(`v1/employee/${id}`),
  deleteVendor: (ids) => request.delete(`v1/employee/delete`, ids),
  activateVendor: (ids) => request.put(`v1/employee/unblock`, ids),
  deActivateVendor: (ids) => request.put(`v1/employee/block`, ids),
  //upload files
  imageUpload: (data) => fileUploadRequest.post('v1/upload/file', data),
  fileUpload: (data) => fileUploadRequest.post('/upload', data),
  //stores
  createStore: (data) => request.post('v1/store', data),
  updateStore: ({ id, data }) => request.put(`v1/store/${id}`, data),
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
  //

  saleCreate: (data) => request.post('v1/sale', data),

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
  getAllRoles: (filter) => request.get(`v1/role/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleRole: (id) => request.get(`v1/role/${id}`),
  createRole: (data) => request.post('v1/role', data),
  deleteRole: (id) => request.delete(`v1/role/multiple/delete`, id),
  editRole: ({ id, data }) => request.put(`v1/role/${id}`, data),
  updateRole: ({ id, data }) => request.patch(`api/roles/${id}`, data),
  deleteClient: (id) => request.delete(`v1/customer/soft-delete`, id),

  // permissions
  createPermission: (data) => request.post(`v1/permission`, data),

  //actions
  getAllActions: () => request.get(`v1/permission/list-parents`),
  getSingleAction: (id) => request.get(`api/actions/${id}`),
  createActionInsertMany: (data) => request.post(`api/actions/insert-many`, data),
  createAction: (data) => request.post(`api/actions`, data),
  deleteActions: (id) => request.delete(`api/actions/${id}`),
  updateAction: ({ id, data }) => request.patch(`api/actions/${id}`, data),

  // role-actions
  createRoleActionInsertMany: (data) => request.post('api/role-actions/insert-many', data),
  // createRole: (data) => request.post('api/role-actions/insert-many', data),
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
