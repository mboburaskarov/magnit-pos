import Switch from '@mui/material/Switch'

export default function StyledSwitch({ register, name, defaultValue, onChange, checked, id, ...props }) {
  return (
    <Switch name={name} id={id} inputRef={register} defaultChecked={defaultValue} value={name} onChange={onChange} checked={checked} disableRipple {...props} />
  )
}
