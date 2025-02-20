import { get } from 'lodash'
import { authRequest, fileUploadRequest, request, yandexMapsRequest } from '../axios'
import * as qs from 'qs'

export const requests = {
  //auth
  logIn: (data) => authRequest.post(`v1/login`, data),

  //user
  getUserInfo: (id) => request.get(`v1/employee/info`),

  //payment types
  getPaymentTypesList: (filter) => request.get(`v1/payment-type/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //sale
  getAllSales: (filter) => request.get(`v1/sale/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllSaleStats: (filter) => request.get(`v1/sale/stats${qs.stringify(filter, { addQueryPrefix: true })}`),
  saleCreate: (data) => request.post('v1/sale', data),
  getCloseCashboxPaymentList: (cashBoxId) => request.get(`v1/sale-payment/list/close-cashbox/${cashBoxId}`),
  changeCloseBoxNetAmout: ({ id, data }) => request.put(`v1/sale-payment/amounts/${id}`, data),
  getCloseCashboxPaymentsInfo: (cashBoxId) => request.get(`v1/sale-payment/total-amount/${cashBoxId}`),
  getCashBoxDetaildWithSaleId: (id) => request.get(`v1/sale/${id}`),
  addToOrderPayment: (data) => request.post(`v1/sale/final`, data),

  //producer
  createProducer: (data) => request.post(`v1/producer`, data),
  getProducer: (filter) => request.get(`v1/producer/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //shelf
  getShelf: (filter) => request.get(`v1/shelf/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  createShelf: (data) => request.post(`v1/shelf`, data),

  //shift
  createShift: (data) => request.post(`v1/shift`, data),

  //employee
  changeEmployeeInfo: (data) => request.put(`v1/employee/info`, data),
  changePassword: (data) => request.put(`v1/employee/reset-password`, data),
  getAllVendors: (filter) => request.get(`v1/employee/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  createVendor: (data) => request.post(`v1/employee`, data),
  updateVendor: ({ id, data }) => request.put(`v1/employee/${id}`, data),
  getSingleVendor: (id) => request.get(`v1/employee/${id}`),
  deleteVendor: (ids) => request.delete(`v1/employee/delete`, ids),
  activateVendor: (ids) => request.put(`v1/employee/unblock`, ids),
  deActivateVendor: (ids) => request.put(`v1/employee/block`, ids),
  getSellerBonusInOneSale: (filter) => request.get(`v1/employee/bonus${qs.stringify(filter, { addQueryPrefix: true })}`),

  //cashbox
  getAllCashBoxList: (filter) => request.get(`v1/cash_box/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  deleteCashBox: (ids) => request.delete(`v1/cash_box/soft-delete`, ids),
  checkSaleExist: (store_id) => request.get(`v1/cash_box/check?store_id=${store_id}`),
  createCashBox: (data) => request.post(`v1/cash_box`, data),
  updateCashBox: ({ id, data }) => request.put(`v1/cash_box/${id}`, data),
  getSingleCashBox: (id) => request.get(`v1/cash_box/${id}`),

  //cash_box_operation
  createCashOperationBox: (data) => request.post(`v1/cash_box_operation`, data),
  getRegisterCashData: (cash_box_id) => cash_box_id && request.get(`v1/cash_box_operation/closed-info/${cash_box_id}`),
  getCashBoxOperationInfo: (cash_box_id) => cash_box_id && request.get(`v1/cash_box_operation/info/${cash_box_id}`),
  closeCashBoxRegister: ({ id, data }) => request.put(`v1/cash_box_operation/close/${id}`, data),

  //import
  getAllImports: (filter) => request.get(`v1/import/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //import-details
  getImportDetails: (filter) => request.get(`v1/import-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  finishImportChecking: (id) => request.patch(`v1/import-detail/accept-some/${id}`),
  loadWithoutChecking: (id) => request.patch(`v1/import-detail/accept-all/${id}`),
  sendScannedImport: (data) => request.patch(`v1/import-detail/add-scan`, data),
  sendScannedImportNumber: ({ id, scanned_count }) => request.put(`v1/import-detail/${id}`, { scanned_count }),

  // autoOrder
  createAutoOrder: (data) => request.post(`v1/auto-order`, data),
  finalAutoOrder: (id) => request.post(`v1/auto-order/send/${id}`),
  autoOrderChangeQuantity: ({ id, ...adjusted_order_quantity }) => request.put(`v1/auto-order-detail/change-quantity/${id}`, { ...adjusted_order_quantity }),
  getAutoOrderDetailList: (filter) => request.get(`v1/auto-order-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAutoOrderList: (filter) => request.get(`v1/auto-order/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //category
  getAllCategories: (filter) => request.get(`v1/category/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getCategory: (id) => request.get(`v1/category/${id}`),
  createCategory: (data) => request.post(`v1/category`, data),
  updateCategory: ({ id, data }) => request.put(`v1/category/${id}`, data),
  deleteCategory: (id) => request.delete(`v1/category`, id),

  //product
  getAllProducer: (filter) => request.get(`v1/product/producer${qs.stringify(filter, { addQueryPrefix: true })}`),
  generateBarcode: () => request.post(`v1/product/generate-barcode`),
  getAllSimilarStoreProducts: (id) => request.get(`v1/product/similar/${id}`),
  getAllProducts: (filter) => request.get(`v1/product/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllProductsStatusCount: (filter) => request.get(`v1/product/total-status-count${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllStoreProducts: (data, filter) => request.get(`v1/product/store/${get(data, 'id')}${qs.stringify(filter, { addQueryPrefix: true })}`),
  createProduct: (data) => request.post(`v1/product`, data),

  getSingleProduct: (id) => request.get(`v1/product/${id}`),
  getSingleProductHistory: (filter, id) => request.get(`v1/product/import/${id}${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleProductRemainsHistory: (filter, id) => request.get(`v1/product/store-product/${id}${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateProduct: ({ id, data }) => request.put(`v1/product/${id}`, data),
  deleteProduct: (id) => request.delete(`v1/product?id=${id}`),

  //customers
  createCustomer: (data) => request.post(`v1/customer`, data),
  getAllCustomers: (filter) => request.get(`v1/customer/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleCustomers: (id) => request.get(`v1/customer/${id}`),
  deleteClient: (id) => request.delete(`v1/customer/soft-delete`, id),

  //draft
  getDarftList: (filter) => request.get(`v1/draft/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDarftChildList: (id) => request.get(`v1/draft/${id}`),
  createDraft: (data) => request.post(`v1/draft`, data),
  deleteDraft: (id) => request.delete(`v1/draft/${id}`),
  completeDraft: (data) => request.put(`v1/draft/complete/${data}`),

  //cart_item
  changeDiscountValue: ({ id, body }) => request.put(`v1/cart_item/sale/${id}`, body),
  changeCartItemQuantity: ({ id, data }) => request.put(`v1/cart_item/${id}`, data),
  createCartItem: (data) => request.post(`v1/cart_item`, data),
  deleteCartItem: (id) => request.delete(`v1/cart_item/${id}`),
  deleteAll: (ids) => request.post(`v1/cart_item/multiple`, ids),
  getCartItemList: (filter) => request.get(`v1/cart_item/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //store
  getAllStores: (filter) => request.get(`v1/store/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  deleteStore: (id) => request.delete(`v1/store/${id}`),
  createStore: (data) => request.post('v1/store', data),
  updateStore: ({ id, data }) => request.put(`v1/store/${id}`, data),

  //unit-types
  getAllUnits: (filter) => request.get(`v1/unit-types/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //permission
  getAllRolesWithPermissions: (filter) => request.get(`v1/permission/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllRolesWithPermissionsLikeCategorySchema: (filter) => request.get(`v1/permission/filter${qs.stringify(filter, { addQueryPrefix: true })}`),
  createPermission: (data) => request.post(`v1/permission`, data),
  getAllActions: () => request.get(`v1/permission/list-parents`),

  //upload files
  imageUpload: (data) => fileUploadRequest.post('v1/upload/file', data),

  // roles
  getAllRoles: (filter) => request.get(`v1/role/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleRole: (id) => request.get(`v1/role/${id}`),
  createRole: (data) => request.post('v1/role', data),
  deleteRole: (id) => request.delete(`v1/role/multiple/delete`, id),
  editRole: ({ id, data }) => request.put(`v1/role/${id}`, data),
}
