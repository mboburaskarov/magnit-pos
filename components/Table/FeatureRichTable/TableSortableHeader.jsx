import { SortableContainer } from 'react-sortable-hoc'

const TableSortableHeader = SortableContainer(({ children, ...rest }) => (
  <tr {...rest}>{children}</tr>
))
export default TableSortableHeader
