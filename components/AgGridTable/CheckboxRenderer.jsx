import { memo, useEffect, useMemo, useRef, useState } from 'react'

const CheckBoxRenderer = ({ node, setAddedItems, setRemovedItems, selectedRowsIds, selectAllCondition }) => {
  const defaultChecked = selectedRowsIds?.includes(node?.data?.id || node?.data?._id)
  const [checked, setChecked] = useState(defaultChecked)
  const checkboxRef = useRef()
  const isVariative = !!node?.data?.variations?.length
  const variationsIds = useMemo(() => node?.data?.variations?.map((el) => el?.id), [node?.data])
  const variationsIdsSelected = useMemo(() => selectedRowsIds.filter((el) => variationsIds?.includes(el)), [selectedRowsIds, variationsIds])

  const checkedHandler = (e) => {
    const checked = e.target.checked
    setChecked(checked)
    if (checked) {
      setAddedItems(node.data)
    } else {
      setRemovedItems(node.data)
    }
    if (isVariative && variationsIdsSelected?.length === variationsIds?.length) {
      checkboxRef.current.checked = true
    }
  }

  useEffect(() => {
    if (isVariative) {
      if (variationsIdsSelected?.length > 0 && variationsIdsSelected?.length !== variationsIds?.length) {
        checkboxRef.current.indeterminate = true
      }
      if (variationsIdsSelected?.length === 0) {
        checkboxRef.current.checked = false
      }
      if (variationsIdsSelected?.length === variationsIds?.length) {
        checkboxRef.current.checked = true
      }
    }
  }, [variationsIdsSelected])

  return (
    <input
      type='checkbox'
      ref={checkboxRef}
      onChange={checkedHandler}
      checked={checked}
      disabled={selectAllCondition}
      style={{
        cursor: selectAllCondition ? 'not-allowed' : 'pointer',
        width: '14px',
        height: '18px',
      }}
    />
  )
}

export default memo(CheckBoxRenderer)
