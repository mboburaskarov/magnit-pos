import { SortableElement } from 'react-sortable-hoc'

const TableSortableHeaderCell = SortableElement(({ children, ...rest }) => (
  <th {...rest}>{children}</th>
))
export default TableSortableHeaderCell
