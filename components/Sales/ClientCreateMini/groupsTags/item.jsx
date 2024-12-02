import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@mui/material'
export default function SocialNetworks({ data, list, setList, type, id }) {
  const { setValue } = useFormContext()

  const [item, setItem] = useState(false)

  const handleAddItems = () => {
    if (item) {
      const newItems = list.filter((el) => el.id !== data.id)
      setList(newItems)
    } else if (list) {
      setList([...list, data])
    }
  }

  useEffect(() => {
    const foundItem = list?.find((el) => el.id === data.id)
    setItem(!!foundItem)
    setValue(type, list)
  }, [data, list])

  return (
    <Button
      id={id}
      variant='contained'
      size='small'
      style={{
        marginRight: 8,
        marginBottom: 8,
      }}
      secondary={!item}
      onClick={handleAddItems}
    >
      {data.name}
    </Button>
  )
}
