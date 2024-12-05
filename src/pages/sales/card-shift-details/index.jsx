import React, { useState } from 'react'
import FeatureRichTable from '../../../../components/Table/FeatureRichTable'
import { tableHeaders } from './table-headers'
import { Button } from '@mui/material'
import CashTypeDrawer from './cashTypeDrawer'

function CardShiftDetails() {
  const [open, setOpen] = useState()
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
      <Button onClick={() => setOpen(true)}>open</Button>
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
      <CashTypeDrawer open={open} setOpen={setOpen} />
    </div>
  )
}

export default CardShiftDetails
