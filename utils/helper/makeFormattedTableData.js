export const makeFormattedData = ({ tableColumns = [], hide = () => false }) => {
  const formattedData = tableColumns?.map((el) => ({
    ...el,
    label: el.headerName,
    desc: el.desc,
    name: el.colId,
    hide: hide(el),
    always_active: el?.always_active ?? el?.always_active,
  }))
  return formattedData
}
