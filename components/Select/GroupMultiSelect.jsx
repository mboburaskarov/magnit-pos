import React from 'react'
import { Checkbox, ListItemText, MenuItem, Select, InputLabel, FormControl, ListSubheader, Box } from '@mui/material'
import { Controller } from 'react-hook-form'

const GroupMultiSelect = ({
  name,
  label,
  control,
  value: controlledValue,
  onChange: controlledOnChange,
  apiData, // Your API response data
  defaultValue = [],
  ...rest
}) => {
  // Transform API data into grouped options
  const groupedOptions = React.useMemo(() => {
    if (!apiData?.data) return []

    const groups = []

    // Add Pharma Cosmos stores (non-franchise)
    if (apiData.data.pharma_cosmos?.stores) {
      groups.push({
        group: apiData.data.pharma_cosmos.company.trim(), // trim to remove extra spaces
        items: apiData.data.pharma_cosmos.stores.map((store) => ({
          id: store.id,
          name: store.name,
          is_franchise: store.is_franchise,
        })),
      })
    }

    // Add each franchise company as a separate group
    if (apiData.data.franchises?.length > 0) {
      apiData.data.franchises.forEach((franchise) => {
        // Only add franchises that have stores with valid data
        const validStores = franchise.stores?.filter((store) => store.id && store.name) || []

        if (validStores.length > 0 || franchise.company) {
          groups.push({
            group: franchise.company || 'Unnamed Franchise',
            groupId: franchise.id, // Store franchise ID if needed
            items: validStores.map((store) => ({
              id: store.id,
              name: store.name,
              is_franchise: store.is_franchise,
            })),
          })
        }
      })
    }

    return groups
  }, [apiData])

  const isRhf = !!control
  const isControlled = controlledValue !== undefined && controlledOnChange

  const handleValueChange = (value, selected, setValue) => {
    const lastSelected = value[value.length - 1]
    const clickedGroup = groupedOptions.find((g) => g.group === lastSelected)

    if (clickedGroup) {
      const groupItemIds = clickedGroup.items.map((item) => item.id)
      const allSelected = groupItemIds.every((id) => selected.includes(id))
      let newSelected

      if (allSelected) {
        newSelected = selected.filter((s) => !groupItemIds.includes(s))
      } else {
        newSelected = [...selected, ...groupItemIds.filter((id) => !selected.includes(id))]
      }
      setValue(newSelected)
    } else {
      setValue(value)
    }
  }

  const handleGroupClick = (group, currentValue, setValue) => {
    const groupItemIds = group.items.map((item) => item.id)
    const allSelected = groupItemIds.every((id) => currentValue.includes(id))
    let newSelected

    if (allSelected) {
      newSelected = currentValue.filter((s) => !groupItemIds.includes(s))
    } else {
      newSelected = [...currentValue, ...groupItemIds.filter((id) => !currentValue.includes(id))]
    }
    setValue(newSelected)
  }

  const [localValue, setLocalValue] = React.useState(defaultValue)

  const renderSelect = (value, setValue) => {
    // Get selected store names for display
    const selectedNames = groupedOptions
      .flatMap((g) => g.items)
      .filter((item) => value.includes(item.id))
      .map((item) => item.name)

    return (
      <FormControl fullWidth>
        {label && <InputLabel>{label}</InputLabel>}
        <Select
          multiple
          value={value}
          onChange={(e) => handleValueChange(e.target.value, value, setValue)}
          renderValue={(selected) => (selectedNames.length > 0 ? selectedNames.join(', ') : '')}
          label={label}
          {...rest}
        >
          {groupedOptions.map((group) => {
            // Only render group if it has items
            if (group.items.length === 0) {
              return (
                <ListSubheader key={group.group} style={{ cursor: 'default', userSelect: 'none' }}>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                    <Box component='span' sx={{ fontWeight: 600, ml: 1 }}>
                      {group.group} (No stores)
                    </Box>
                  </Box>
                </ListSubheader>
              )
            }

            return [
              <ListSubheader key={group.group} onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }} onClick={(e) => handleGroupClick(group, value, setValue)}>
                  <Checkbox
                    checked={group.items.every((item) => value.includes(item.id))}
                    indeterminate={group.items.some((item) => value.includes(item.id)) && !group.items.every((item) => value.includes(item.id))}
                  />
                  <Box component='span' sx={{ fontWeight: 600 }}>
                    {group.group}
                  </Box>
                </Box>
              </ListSubheader>,
              ...group.items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <Checkbox checked={value.includes(item.id)} />
                  <ListItemText primary={item.name} />
                </MenuItem>
              )),
            ]
          })}
        </Select>
      </FormControl>
    )
  }

  if (isRhf) {
    return (
      <Controller name={name} control={control} defaultValue={defaultValue} render={({ field: { value, onChange } }) => renderSelect(value || [], onChange)} />
    )
  }

  if (isControlled) {
    return renderSelect(controlledValue, controlledOnChange)
  }

  return renderSelect(localValue, setLocalValue)
}

export default GroupMultiSelect
