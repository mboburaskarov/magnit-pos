import React, { useMemo } from 'react'

const checkTableProps = (WrappedComponent) =>
  function EnhancedComponent({ data, columns, ...rest }) {
    const tableData = useMemo(() => (data?.length ? data : []), [data])
    const tableColumns = useMemo(
      () =>
        columns?.length
          ? columns
              ?.slice()
              ?.sort((a, b) => a?.sequence_number - b?.sequence_number) || []
          : [],
      [columns]
    )
    return (
      <>
        <WrappedComponent {...rest} data={tableData} columns={tableColumns} />
      </>
    )
  }

export default checkTableProps
