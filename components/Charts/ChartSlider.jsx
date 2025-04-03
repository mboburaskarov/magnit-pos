import { withStyles } from '@mui/styles'
import Slider from '@mui/material/Slider'
import { Box } from '@mui/material'

const AirbnbSlider = withStyles((theme) => ({
  root: {
    color: theme.palette.orange[400],
    height: 2,
    marginTop: 24,
  },
  thumb: {
    height: 48,
    width: 24,
    backgroundColor: theme.palette.orange[400],
    borderRadius: 16,

    '&:focus, &:hover, &$active': {
      boxShadow: `none`,
      cursor: 'ew-resize',
    },
    '& .bar': {
      display: 'inline-block !important',
      height: 16,
      width: 4,
      backgroundColor: 'red',
      marginLeft: 1,
      marginRight: 1,
      borderRadius: 16,
    },
    '&::after': {
      top: '50%',
      left: '50%',
      background: 'white',
      height: 16,
      width: 4,
      content: '" "',
      position: 'absolute',
      borderRadius: 16,
    },
  },

  track: {
    height: 32,
    color: theme.palette.orange[100],
  },
  rail: {
    color: theme.palette.orange[100],
    opacity: 1,
    height: 32,
    borderRadius: 16,
  },
}))(Slider)

export default function ChartSlider({ max, min, defaultValue = [20, 40], value, onChange }) {
  return (
    <Box pb={3} pl={3} pr={2}>
      <AirbnbSlider
        getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
        defaultValue={defaultValue}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    </Box>
  )
}
