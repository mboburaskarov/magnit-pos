import { Box } from '@mui/material'
import Slider from '@mui/material/Slider'
import { withStyles } from '@mui/styles'

const AirbnbSlider = withStyles((theme) => ({
  root: {
    color: theme.palette.orange[400],
    height: 2,
    marginTop: 24,
  },
  thumb: {
    height: 24,
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
      height: 4,
      width: 4,
      content: '" "',
      position: 'absolute',
      borderRadius: 16,
    },
  },

  track: {
    height: 10,
    color: theme.palette.orange[100],
  },
  rail: {
    color: theme.palette.orange[100],
    opacity: 1,
    height: 12,
    borderRadius: 16,
  },
}))(Slider)

export default function ChartSlider({ max, min, defaultValue = [20, 40], value, onChange }) {
  return (
    <Box pb={1} pl={3} pr={2}>
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
