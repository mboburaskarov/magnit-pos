import { makeStyles } from '@mui/styles'
import StyledTreeView from './TreeView'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    minHeight: 56,
  },
  list: {
    '& .MuiTreeItem-root': {
      width: '100%',
      background: theme.palette.gray[100],
      borderRadius: 16,
      marginTop: 8,
    },
    '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label':
      {
        background: 'none',
      },
  },
  content: {
    borderRadius: 8,
  },
  svg: {
    width: 24,
    height: 24,
    color: theme.palette.blue[500],
  },
  category: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: 48,
    padding: '0 12px',
    borderTop: `1px solid #CFCFCF`,
  },
  listItem: {
    '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label':
      {
        background: 'transparent !important',
      },
  },
}))
export default function TreeSelect({
  selected,
  setSelected,
  categories,
  disabled,
  handleCreate,
  searchTerm,
  highlight,
  roles,
}) {
  const classes = useStyles()
  return (
    <StyledTreeView
      classes={classes}
      selected={selected}
      onSelect={setSelected}
      searchTerm={searchTerm}
      highlight={highlight}
      categories={categories}
      disabled={disabled}
      handleCreate={handleCreate}
      roles={roles}
    />
  )
}
