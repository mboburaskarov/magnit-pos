import React from 'react'
import FeatureRichTable from '../../../../components/Table/FeatureRichTable'
import { tableHeaders } from './table-headers'

function CardShiftDetails() {
  const columns = tableHeaders({
    setPayment: () => {},
    setOpenCurrencyValue: () => {},
    currencyValue: () => {},
    systemValue: () => {},
    t: () => {},
    webkassa24: [],
    forbiddenRoutes: [],
  })
  return (
    <div>
      <FeatureRichTable
        columns={[]}
        data={[{}]}
        isDataLoading={false}
        tableSettings={false}
        totalData={[]}
        pagination={false}
        customTablePadding='8px 14px'
        blueTotalData
        // updateMyData={updateTableData}
      />
    </div>
  )
}

export default CardShiftDetails
