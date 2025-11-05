import React from 'react'
import { Checkbox, ListItemText, MenuItem, Select, InputLabel, FormControl, ListSubheader, Box } from '@mui/material'
import { Controller } from 'react-hook-form'

const GroupMultiSelect = ({
  name,
  label,
  control, // optional (react-hook-form)
  value: controlledValue, // optional (controlled)
  onChange: controlledOnChange, // optional (controlled)
  groupedOptions,
  defaultValue = [],
  ...rest
}) => {
  // Detect mode: react-hook-form, controlled, or uncontrolled
  const isRhf = !!control
  const isControlled = controlledValue !== undefined && controlledOnChange

  // handle change logic shared across all modes
  const handleValueChange = (value, selected, setValue) => {
    const lastSelected = value[value.length - 1]
    const clickedGroup = groupedOptions.find((g) => g.group === lastSelected)

    if (clickedGroup) {
      const groupItems = clickedGroup.items
      const allSelected = groupItems.every((item) => selected.includes(item))
      let newSelected

      if (allSelected) {
        // Deselect all in group
        newSelected = selected.filter((s) => !groupItems.includes(s))
      } else {
        // Select all in group
        newSelected = [...selected, ...groupItems.filter((item) => !selected.includes(item))]
      }
      setValue(newSelected)
    } else {
      setValue(value)
    }
  }

  // Handle group header click
  const handleGroupClick = (group, currentValue, setValue) => {
    const groupItems = group.items
    const allSelected = groupItems.every((item) => currentValue.includes(item))
    let newSelected

    if (allSelected) {
      // Deselect all in group
      newSelected = currentValue.filter((s) => !groupItems.includes(s))
    } else {
      // Select all in group
      newSelected = [...currentValue, ...groupItems.filter((item) => !currentValue.includes(item))]
    }
    setValue(newSelected)
  }

  // Uncontrolled (local) state
  const [localValue, setLocalValue] = React.useState(defaultValue)

  // Render the inner select
  const renderSelect = (value, setValue) => (
    <FormControl fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        multiple
        value={value}
        onChange={(e) => handleValueChange(e.target.value, value, setValue)}
        renderValue={(selected) => selected.join(', ')}
        label={label}
        {...rest}
      >
        {groupedOptions.map((group) => [
          <ListSubheader
            key={group.group}
            onClick={(e) => {
              e.stopPropagation()
            }}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <Box sx={{ flex: 1 }} onClick={(e) => handleGroupClick(group, value, setValue)}>
              <Checkbox
                checked={group.items.every((item) => value.includes(item))}
                indeterminate={group.items.some((item) => value.includes(item)) && !group.items.every((item) => value.includes(item))}
              />
              {group.group}
            </Box>
          </ListSubheader>,
          group.items.map((item) => (
            <MenuItem key={item} value={item}>
              <Checkbox checked={value.includes(item)} />
              <ListItemText primary={item} />
            </MenuItem>
          )),
        ])}
      </Select>
    </FormControl>
  )

  // RHF Mode
  if (isRhf) {
    return (
      <Controller name={name} control={control} defaultValue={defaultValue} render={({ field: { value, onChange } }) => renderSelect(value || [], onChange)} />
    )
  }

  // Controlled Mode
  if (isControlled) {
    return renderSelect(controlledValue, controlledOnChange)
  }

  // Uncontrolled Mode
  return renderSelect(localValue, setLocalValue)
}

export default GroupMultiSelect
