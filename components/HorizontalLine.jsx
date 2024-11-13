import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  line: {
    width: '100%',
    border: `2px dashed ${theme.palette.grey[200]}`,
    borderStyle: 'none none dashed',
    color: '#fff',
    backgroundColor: theme.palette.background.default,
    marginTop: 32,
    marginBottom: 32,
  },
}))
export default function HorizontalLine() {
  const clasess = useStyles()
  return <hr className={clasess.line} />
}
