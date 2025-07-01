import { get } from 'lodash'
import * as qs from 'qs'
import { authRequest, eposRequest, fileUploadRequest, request, requestEXCEL } from '../axios'

export const requests = {
  //epos
  sendToEpos: (data) => eposRequest.post(import.meta.env.VITE_MODE == 'dev' ? `/helper/epos` : `/uzpos`, data),
  closeZReport: (data) => eposRequest.post(import.meta.env.VITE_MODE == 'dev' ? `/helper/epos` : `/uzpos`, data),
  closeCheckZReport: (data) => eposRequest.post(import.meta.env.VITE_MODE == 'dev' ? `/helper/epos` : `/uzpos`, data),
  openZReport: (data) => eposRequest.post(import.meta.env.VITE_MODE == 'dev' ? `/helper/epos` : `/uzpos`, data),
  getZReportByDate: (data) => eposRequest.post(import.meta.env.VITE_MODE == 'dev' ? `/helper/epos` : `/uzpos`, data),
  sendEPOSresponseToBackend: (data) => request.post(`v1/sale/epos-result`, data),
  checkEPOSTurnOn: (data) => eposRequest.post(import.meta.env.VITE_MODE == 'dev' ? `/helper/epos` : `/uzpos`, data),

  //tags
  getAllTags: (filter) => request.get(`v1/tag/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  createTag: (data) => request.post(`v1/tag`, data),

  /// company
  changeComanyInfo: ({ id, data }) => request.put(`v1/company/${id}`, data),
  getComanyInfo: () => request.get(`v1/company/info`),

  //dashboard
  dashboradChart: ({ store_ids, ...filter }) => request.post(`v1/dashboard/chart${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  dashboradCountStats: ({ store_ids, ...filter }) => request.post(`v1/dashboard/count-stats${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  dashboradTopStores: ({ store_ids, ...filter }) => request.post(`v1/dashboard/top-stores${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  dashboradPayments: ({ store_ids, ...filter }) => request.post(`v1/dashboard/payments${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  dashboradTransaction: ({ store_ids, ...filter }) => request.post(`v1/dashboard/transaction${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  dashboradTopProducts: ({ store_ids, ...filter }) => request.post(`v1/dashboard/top-products${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  dashboradTopSellers: ({ store_ids, ...filter }) => request.post(`v1/dashboard/top-seller${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  dashboradTopBonusProducts: ({ store_ids, ...filter }) =>
    request.post(`v1/dashboard/bonus-products${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),

  //auth
  logIn: (data) => authRequest.post(`v1/login`, data),

  //user
  getUserInfo: (id) => request.get(`v1/employee/info`),

  //payment types
  getPaymentTypesList: (filter) => request.get(`v1/payment-type/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //sale
  getAllSalesExcelReport: (filter) => requestEXCEL.get(`v1/sale/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),

  getAllSales: (filter) => request.get(`v1/sale/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllSaleStats: (filter) => request.get(`v1/sale/stats${qs.stringify(filter, { addQueryPrefix: true })}`),
  saleCreate: (data) => request.post('v1/sale', data),
  getCloseCashboxPaymentList: (cashBoxId) => request.get(`v1/sale-payment/list/close-cashbox/${cashBoxId}`),
  changeCloseBoxNetAmout: ({ id, data }) => request.put(`v1/sale-payment/amounts/${id}`, data),
  getCloseCashboxPaymentsInfo: (cashBoxId) => request.get(`v1/sale-payment/total-amount/${cashBoxId}`),
  getCashBoxDetaildWithSaleId: (id) => request.get(`v1/sale/${id}`),
  addToOrderPayment: (data) => request.post(`v1/sale/final`, data),
  returnSaleItem: (data) => request.post(`v1/sale/return`, data),
  addDiscountCard: (data) => request.post(`v1/sale/discount-card`, data),
  removeDiscountCard: (data) => request.delete(`v1/sale/discount-card`, data),
  //producer
  createProducer: (data) => request.post(`v1/producer`, data),
  getProducer: (filter) => request.get(`v1/producer/list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //shelf
  getShelf: (filter) => request.get(`v1/shelf/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  createShelf: (data) => request.post(`v1/shelf`, data),

  //report seller bonus
  getSellerBonus: (filter, storeId) =>
    request.post(`v1/report/bonus${qs.stringify(filter, { addQueryPrefix: true })}`, storeId?.length > 0 ? storeId : undefined),
  getsellerBonusExcelReport: (filter) => requestEXCEL.post(`v1/report/bonus-export${qs.stringify(filter, { addQueryPrefix: true })}`),
  // / report product
  getProductReport: ({ store_ids, ...filter }) => request.post(`v1/report/product${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  getPorductReportExcelReport: (filter) => requestEXCEL.post(`v1/report/product-export${qs.stringify(filter, { addQueryPrefix: true })}`),
  getProductReportStat: (filter) => request.post(`v1/report/product-status${qs.stringify(filter, { addQueryPrefix: true })}`),

  // / report store
  getStoreReport: (filter) => request.post(`v1/report/store-amount${qs.stringify(filter, { addQueryPrefix: true })}`),
  getStoreReportExcelReport: (filter) => requestEXCEL.post(`v1/report/store-amount/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  getStoreStats: (filter) => request.post(`v1/report/store-stats${qs.stringify(filter, { addQueryPrefix: true })}`),

  // report product
  topProductsReport: ({ store_ids, ...filter }) => request.post(`v1/report/top-products${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  bonusProductsReport: ({ store_ids, ...filter }) => request.post(`v1/report/bonus-products${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  topVendorReport: ({ store_ids, ...filter }) => request.post(`v1/report/top-seller${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),
  topBranchReport: ({ store_ids, ...filter }) => request.post(`v1/report/top-stores${qs.stringify(filter, { addQueryPrefix: true })}`, store_ids),

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
  getVendorsExcelReport: (filter) => requestEXCEL.get(`v1/employee/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  //cashbox
  getAllCashBoxList: (filter) => request.get(`v1/cash_box/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  deleteCashBox: (ids) => request.delete(`v1/cash_box/soft-delete`, ids),
  checkSaleExist: ({ store_id, device_id }) => request.get(`v1/cash_box/check?store_id=${store_id}&device_id=${device_id}`),
  createCashBox: (data) => request.post(`v1/cash_box`, data),
  updateCashBox: ({ id, data }) => request.put(`v1/cash_box/${id}`, data),
  getSingleCashBox: (id) => request.get(`v1/cash_box/${id}`),
  getOpenCashBoxList: (filter) => request.get(`v1/cash_box/open-list${qs.stringify(filter, { addQueryPrefix: true })}`),

  //cash_box_operation
  createCashOperationBox: (data) => request.post(`v1/cash_box_operation`, data),
  getCashBoxShiftsList: (filter) => request.get(`v1/cash_box_operation/shift${qs.stringify(filter, { addQueryPrefix: true })}`),
  getCashBoxShiftsHistoryList: (filter) => request.get(`v1/cash_box_operation/history${qs.stringify(filter, { addQueryPrefix: true })}`),
  getCashBoxShiftsStat: (filter) => request.get(`v1/cash_box_operation/stats${qs.stringify(filter, { addQueryPrefix: true })}`),

  getRegisterCashData: (cash_box_id) => cash_box_id && request.get(`v1/cash_box_operation/closed-info/${cash_box_id}`),
  getCashBoxOperationInfo: (cash_box_id) => cash_box_id && request.get(`v1/cash_box_operation/info/${cash_box_id}`),
  closeCashBoxRegister: ({ id, data }) => request.put(`v1/cash_box_operation/close/${id}`, data),

  //import
  getAllImports: (filter) => request.get(`v1/import/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getImportsExcelReport: (filter) => requestEXCEL.get(`v1/import/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  getImportStatusCount: (filter) => request.get(`v1/import/list-status${qs.stringify(filter, { addQueryPrefix: true })}`),

  //import-details
  getAllImportsDetailStatusCount: ({ id, filter }) =>
    request.get(`v1/import-detail/get-stock-status-counts/${id}${qs.stringify(filter, { addQueryPrefix: true })}`),
  getImportDetails: (filter) => request.get(`v1/import-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getImportScanDetails: (filter) => request.get(`v1/import-detail/list/by-last-updated${qs.stringify(filter, { addQueryPrefix: true })}`),
  finishImportChecking: (id) => request.patch(`v1/import-detail/accept-some/${id}`),
  loadWithoutChecking: (id) => request.patch(`v1/import-detail/accept-all/${id}`),
  sendScannedImport: (data) => request.patch(`v1/import-detail/add-scan`, data),
  sendScannedImportById: (data) => request.post(`v1/import-detail/add-scan-by-id`, data),
  sendScannedImportNumber: ({ id, scanned_count }) => request.put(`v1/import-detail/${id}`, { scanned_count }),
  getImportDetailsExcelReport: (filter) => requestEXCEL.get(`v1/import-detail/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),

  //writeOff
  createWriteOff: (data) => request.post(`v1/write-off`, data),
  getAllWriteOff: (filter) => request.get(`v1/write-off/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  sendScannedWriteOffNumber: ({ id, product_id, type, scanned_count }) =>
    request.patch(`v1/write-off/${id}/add-product-by-barcode`, { count: scanned_count, type, id: product_id }),
  getWriteOffDetails: (filter) => request.get(`v1/write-off-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getWriteOffDashBoard: (id) => request.get(`v1/write-off/${id}`),
  getWriteOffScanDetails: (filter) => request.get(`v1/import-detail/list/by-last-updated${qs.stringify(filter, { addQueryPrefix: true })}`),
  finishWriteOffChecking: (id) => request.post(`v1/write-off/confirm/${id}`),
  deleteWriteOff: ({ id }) => request.post(`v1/write-off/cancel/${id}`),
  //return to warehouse
  resend1cReturnTOwarehouse: (id) => request.post(`v1/return/send1c/${id}`),
  downloadReturnNakladnoy: (filter) => requestEXCEL.get(`v1/return/export-nakladnoy${qs.stringify(filter, { addQueryPrefix: true })}`),

  createReturnToWarehouse: (data) => request.post(`v1/return`, data),
  getAllReturnToWarehouse: (filter) => request.get(`v1/return/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  sendScannedReturnToWarehouseNumber: ({ id, barcode, product_id, type, scanned_unit, scanned_pack }) =>
    request.patch(`v1/return/${id}/add-product-by-barcode`, { scanned_pack, scanned_unit, type, id: product_id }),
  getReturnToWarehouseDetails: (filter) => request.get(`v1/return-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getReturnToWarehouseDashBoard: (id) => request.get(`v1/return/${id}`),
  getReturnToWarehouseScanDetails: (filter) => request.get(`v1/import-detail/list/by-last-updated${qs.stringify(filter, { addQueryPrefix: true })}`),
  finishReturnToWarehouseChecking: (id) => request.post(`v1/return/confirm/${id}`),
  SentReturnToWarehouseChecking: (id) => request.post(`v1/return/send/${id}`),
  deleteReturnToWarehouse: ({ id }) => request.post(`v1/return/cancel/${id}`),
  getReturnToWarehouseExcelReport: (filter) => requestEXCEL.get(`v1/return/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  getReturnToWarehouseDetailsExcelReport: (filter) => requestEXCEL.get(`v1/return-detail/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  //inventory
  createInventory: (data) => request.post(`v1/inventory`, data),
  getAllInventory: (filter) => request.get(`v1/inventory/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  sendScannedInventoryNumber: ({ id, barcode, product_id, expire_date, fact_unit, type, fact_quantity, scanned_count, retail_price }) =>
    request.patch(`v1/inventory/${id}/add-product-by-barcode`, {
      count: scanned_count,
      expire_date,
      fact_unit,
      fact_quantity,
      type,
      barcode,
      retail_price,
      id: product_id,
    }),
  sendScannedInventoryFlowNumber: ({ id, barcode, retail_price, product_id, expire_date, fact_unit, type, fact_quantity, scanned_count }) =>
    request.patch(`v1/inventory/${id}/detailed-flow`, {
      count: scanned_count,
      expire_date,
      fact_unit,
      fact_quantity,
      type,
      barcode,
      id: product_id,
      retail_price,
    }),
  getInventoryDetails: (filter) => request.get(`v1/inventory-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getInventoryDetailFlow: (filter) => request.get(`v1/inventory-detail/detailed-flow${qs.stringify(filter, { addQueryPrefix: true })}`),
  getInventoryScanDetails: (filter) => request.get(`v1/import-detail/list/by-last-updated${qs.stringify(filter, { addQueryPrefix: true })}`),
  finishInventoryChecking: (id) => request.post(`v1/inventory/confirm/${id}`),
  deleteInventory: ({ id }) => request.post(`v1/inventory/cancel/${id}`),
  resend1cInventory: (id) => request.post(`v1/inventory/send1c/${id}`),
  getInventoryStat: (id, filter) => request.get(`v1/inventory/${id}${qs.stringify(filter, { addQueryPrefix: true })}`),
  getInventoryExcelReport: (filter) => requestEXCEL.get(`v1/inventory-detail/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  getPriceOptions: (filter) => request.get(`v1/inventory-detail/price-option${qs.stringify(filter, { addQueryPrefix: true })}`),

  //transfer
  createTransfer: (data) => request.post(`v1/transfer`, data),
  getAllTransfer: (filter) => request.get(`v1/transfer/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  sendScannedTransferNumber: ({ id, barcode, product_id, type, scanned_unit, scanned_pack }) =>
    request.patch(`v1/transfer/${id}/add-product-by-barcode`, { scanned_unit, scanned_pack, type, id: product_id }),
  getTransferDetails: (filter) => request.get(`v1/transfer-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getTransferDashBoard: (id) => request.get(`v1/transfer/${id}`),
  getTransferScanDetails: (filter) => request.get(`v1/import-detail/list/by-last-updated${qs.stringify(filter, { addQueryPrefix: true })}`),
  finishTransferChecking: (id) => request.post(`v1/transfer/confirm/${id}`),
  SentTransferChecking: (id) => request.post(`v1/transfer/send/${id}`),
  deleteTransfer: ({ id }) => request.post(`v1/transfer/cancel/${id}`),
  getTransferExcelReport: (filter) => requestEXCEL.get(`v1/transfer/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  getTransferDetailsExcelReport: (filter) => requestEXCEL.get(`v1/transfer-detail/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  downloadTransferNakladnoy: (filter) => requestEXCEL.get(`v1/transfer/export-nakladnoy${qs.stringify(filter, { addQueryPrefix: true })}`),

  // autoOrder
  createAutoOrder: (data) => request.post(`v1/auto-order`, data),
  finalAutoOrder: (id) => request.post(`v1/auto-order/send/${id}`),
  autoOrderChangeQuantity: ({ id, ...adjusted_order_quantity }) => request.put(`v1/auto-order-detail/change-quantity/${id}`, { ...adjusted_order_quantity }),
  getAutoOrderDetailList: (filter) => request.get(`v1/auto-order-detail/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAutoOrderList: (filter) => request.get(`v1/auto-order/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAutoOrderExcelReport: (filter) => requestEXCEL.get(`v1/auto-order-detail/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),

  //repricing
  createRevaluation: (data) => request.post(`v1/repricing`, data),
  finishRevaluation: (id) => request.post(`v1/repricing/confirm/${id}`),

  getRevaluationList: (filter) => request.get(`v1/repricing/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getRevaluationDetailList: (id) => request.get(`v1/repricing-detail/list/${id}`),
  getRevaluation: (id) => request.get(`v1/repricing/${id}`),
  changePriceNew: ({ id, new_retail_price, product_id, store_product_id }) =>
    request.post(`v1/repricing/new-price/${id}`, {
      new_retail_price,
      store_product_id,
      id: product_id,
    }),
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
  getAllProductsByImport: (filter) => request.get(`v1/product/list-by-import${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllProductsStatusCount: (filter) => request.get(`v1/product/total-status-count${qs.stringify(filter, { addQueryPrefix: true })}`),
  getAllStoreProducts: (data, filter) => request.get(`v1/product/store/${get(data, 'id')}${qs.stringify(filter, { addQueryPrefix: true })}`),
  createProduct: (data) => request.post(`v1/product`, data),
  changeBarcode: ({ id, barcode, unit_code, mxik, unit_label }) => request.put(`v1/product/update-barcode/${id}`, { id, barcode, unit_label, unit_code, mxik }),
  changeBarcodeByImport: ({ id, barcode, unit_code, mxik, unit_label, expire_date }) =>
    request.put(`v1/product/update-mxik-import/${id}`, { id, barcode, unit_label, unit_code, mxik, expire_date }),
  getProductBonusList: (filter) => request.get(`v1/product-bonus/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getProductMinMaxList: (filter) => request.get(`v1/product/list-min-max${qs.stringify(filter, { addQueryPrefix: true })}`),
  createBonusProduct: (data) => request.post(`v1/product-bonus`, data),
  editBonusProduct: ({ data, id }) => request.put(`v1/product-bonus/${id}`, data),
  createMinMax: (data) => request.post(`v1/product/min-max`, data),
  editMinMax: ({ id, data }) => request.put(`v1/product/min-max/${id}`, data),

  getProductListForSelect: (filter) => request.get(`v1/product/product-list${qs.stringify(filter, { addQueryPrefix: true })}`),
  deleteBonusProduct: (id) => request.delete(`v1/product-bonus`, id),
  setMarkingRequired: ({ product_id, is_marking }) => request.patch(`v1/product/is-marking`, { product_id, is_marking }),
  setImportMarkingRequired: ({ product_id, id, is_marking, is_checking }) =>
    request.patch(`v1/product/store-is-marking`, { product_id, id, is_checking, is_marking }),
  getProductsExcelReport: (filter) => requestEXCEL.get(`v1/product/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  getProductsExcelReportForAA: (filter) => requestEXCEL.get(`v1/product/export-arzon${qs.stringify(filter, { addQueryPrefix: true })}`),

  getSingleProduct: (id) => request.get(`v1/product/${id}`),
  getSingleProductMovement: (filter, id) => request.get(`v1/product/${id}/product-movement${qs.stringify(filter, { addQueryPrefix: true })}`),
  // getSingleProductHistory: (filter, id) => request.get(`v1/product/import/${id}${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleProductRemainsHistory: (filter, id) => request.get(`v1/product/store-product/${id}${qs.stringify(filter, { addQueryPrefix: true })}`),
  updateProduct: ({ id, data }) => request.put(`v1/product/${id}`, data),
  deleteProduct: (id) => request.delete(`v1/product/soft-delete`, id),

  //customers
  createCustomer: (data) => request.post(`v1/customer`, data),
  getAllCustomers: (filter) => request.get(`v1/customer/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleCustomers: (id) => request.get(`v1/customer/${id}`),
  deleteClient: (id) => request.delete(`v1/customer/soft-delete`, id),
  getClientsExcelReport: (filter) => requestEXCEL.get(`v1/customer/export-excel${qs.stringify(filter, { addQueryPrefix: true })}`),
  //draft
  getDarftList: (filter) => request.get(`v1/draft/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getDarftChildList: (id) => request.get(`v1/draft/${id}`),
  createDraft: (data) => request.post(`v1/draft`, data),
  deleteDraft: (id) => request.delete(`v1/draft/${id}`),
  completeDraft: (data) => request.put(`v1/draft/complete/${data}`),
  // report lfl
  getReportLFL: (filter) => request.post(`v1/report/lfl${qs.stringify(filter, { addQueryPrefix: true })}`),

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
  editPermission: ({ id, data }) => request.put(`v1/permission/${id}`, data),
  getAllActions: () => request.get(`v1/permission/list-parents`),
  deletePermission: (id) => request.delete(`v1/permission/delete`, id),
  getPermissionById: (id) => request.get(`v1/permission/${id}`),
  // payment service assets
  getPaymentAssetsList: (filter) => request.get(`v1/payment-service/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getPaymentAsset: (id) => request.get(`v1/payment-service/${id}`),

  createPaymentAsset: (data) => request.post(`v1/payment-service`, data),
  editPaymentAsset: ({ id, data }) => request.put(`v1/payment-service/${id}`, data),
  //upload files
  imageUpload: (data) => fileUploadRequest.post('v1/upload/file', data),
  cvUpload: (data) => fileUploadRequest.post('v1/inventory-detail/upload-excel', data),

  // roles
  getAllRoles: (filter) => request.get(`v1/role/list${qs.stringify(filter, { addQueryPrefix: true })}`),
  getSingleRole: (id) => request.get(`v1/role/${id}`),
  createRole: (data) => request.post('v1/role', data),
  deleteRole: (id) => request.delete(`v1/role/multiple/delete`, id),
  editRole: ({ id, data }) => request.put(`v1/role/${id}`, data),
}
