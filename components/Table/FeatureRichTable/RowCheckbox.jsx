import React, { forwardRef, useEffect, useRef } from 'react'

const RowCheckbox = forwardRef(({ indenterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef
  useEffect(() => {
    resolvedRef.current.indeterminate = indenterminate
  }, [resolvedRef, indenterminate])

  return rest?.percentage > 1 &&
    rest?.percentage < 100 &&
    rest?.title === 'Toggle All Current Page Rows Selected' ? null : (
    <input type='checkbox' ref={resolvedRef} {...rest} />
  )
})
export default RowCheckbox
