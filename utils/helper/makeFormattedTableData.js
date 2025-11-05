export const makeFormattedData = ({ tableColumns = [] }) => {
  const formattedData = tableColumns?.map((el) => ({
    ...el,
    label: el.headerName,
    desc: el.desc,
    name: el.colId,
    always_active: el?.always_active ?? el?.always_active,
  }))
  return formattedData
}
