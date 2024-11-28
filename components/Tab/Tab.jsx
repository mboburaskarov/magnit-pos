import { Link } from 'react-router-dom'
import { Box } from '@mui/material'

const TabButton = ({ count, countOnTop, primary, selected, icon, name, onChange, id }) => {
  const width = Number(count.replaceAll(' ', '')) > 9999 ? 84 : Number(count.replaceAll(' ', '')) > 999 ? 76 : Number(count.replaceAll(' ', '')) > 99 ? 60 : 42
  return (
    <Box
      id={id}
      onClick={onChange && onChange}
      sx={(theme) => ({
        padding: '8px 16px',
        borderRadius: 3.5,
        backgroundColor: selected ? theme.palette.gray[countOnTop ? 200 : 100] : countOnTop ? theme.palette.gray[100] : 'transparent',
        color: selected ? theme.palette.gray[600] : theme.palette.gray[400],
        fontWeight: 600,
        fontSize: 16,
        lineHeight: '19px',
        border: 0,
        margin: primary ? '0px 4px 6px 0' : 0,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s',
        mt: countOnTop ? 1 : 0,
        ml: countOnTop ? 1 : 0,

        '&:hover': {
          backgroundColor: theme.palette.gray[countOnTop ? 200 : 100],
          color: selected ? theme.palette.gray[600] : theme.palette.gray[400],
          '#countTop': { backgroundColor: theme.palette.gray[countOnTop ? 200 : 100] },
        },
      })}
    >
      {icon || ''} {name}
      {countOnTop && (
        <Box
          id='countTop'
          onClick={onChange && onChange}
          sx={(theme) => ({
            padding: '6px 16px 4px 16px',
            borderRadius: '12px 12px 0 0',
            backgroundColor: selected ? theme.palette.gray[200] : theme.palette.gray[100],
            color: selected ? theme.palette.gray[600] : theme.palette.gray[400],
            fontWeight: 600,
            fontSize: 14,
            lineHeight: '16px',
            border: 0,
            margin: primary ? '0px 4px 6px 0' : 0,
            cursor: 'pointer',
            position: 'absolute',
            top: -16,
            left: `calc(50% - ${width / 2}px)`,
            transition: 'background-color 0.2s',
            width: width,
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
          })}
        >
          {count}
        </Box>
      )}
    </Box>
  )
}

const Tab = ({ count, countOnTop, primary = false, link, name, selected, id, setTab, icon, ...rest }) => {
  const onChange = (e) => {
    e.preventDefault()
    if (setTab) {
      setTab(id)
    }
  }

  return (
    <>
      {link ? (
        <Link to={link || '/'} onClick={onChange} {...rest}>
          <TabButton countOnTop={countOnTop} count={count} id={id} primary={primary} selected={selected} name={name} icon={icon} />
        </Link>
      ) : (
        <TabButton count={count} countOnTop={countOnTop} id={id} onChange={onChange} primary={primary} selected={selected} name={name} icon={icon} />
      )}
    </>
  )
}

export default Tab
