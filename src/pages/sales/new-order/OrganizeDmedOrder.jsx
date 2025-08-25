import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { Box, Button, Dialog, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// 🔹 Draggable Item
function Draggable({ id, label }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { label }, // ✅ attach label here
  })

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    padding: '8px 16px',
    margin: '8px',
    background: '#333',
    color: 'white',
    borderRadius: '8px',
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {label}
    </div>
  )
}

// 🔹 Droppable Container
function Droppable({ id, items, children }) {
  const { isOver, setNodeRef } = useDroppable({ id })

  const style = {
    minHeight: '120px',
    minWidth: '150px',
    margin: '8px',
    padding: '8px',
    border: '2px dashed #333',
    borderRadius: '12px',
    background: isOver ? '#e0e7ff' : '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children}
      {items.map((item) => (
        <Draggable key={item.id} id={item.id} label={item.label} />
      ))}
    </div>
  )
}
function OrganizeDmedOrder({ open, handleClose, medicine, dmedPrescriptionsList }) {
  const { t } = useTranslation()
  const [containers, setContainers] = useState({ outside: [] })
  console.log(medicine)
  useEffect(() => {
    if (dmedPrescriptionsList) {
      setContainers({
        outside: medicine.map((item) => ({ id: item.id, label: item?.name })), // ✅ correct
        ...Object.fromEntries(dmedPrescriptionsList.map((item) => [item.id, []])),
      })
    }
  }, [dmedPrescriptionsList, medicine])

  // Handle drag end
  const handleDragEnd = (event) => {
    const { over, active } = event

    if (over) {
      setContainers((prev) => {
        // Remove from old container
        const newContainers = { ...prev }
        for (const key in newContainers) {
          newContainers[key] = newContainers[key].filter((i) => i.id !== active.id)
        }
        // Add to new container
        newContainers[over.id] = [...newContainers[over.id], { id: active.id, label: active.data.current?.label || active.id }]
        return newContainers
      })
    }
  }
  console.log(containers, 'gg')

  return (
    <Dialog
      sx={{
        '.MuiPaper-root': {
          borderRadius: '20px',
          position: 'relative !important',
          pb: '10px',
        },
      }}
      onClose={handleClose}
      open={open}
      disableScrollLock
    >
      <Box sx={{ minWidth: '600px', padding: '20px' }}>
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#f3f3f3',
            m: '10px 0px',
            borderRadius: '20px',
          }}
        >
          <Typography color={'#fe5000'} fontWeight={'500'}>
            Утилизируйте препарат именно какой рецепт, если вы дали его рецепту
          </Typography>
        </Box>
      </Box>
      <Box p={'0 20px'}>
        <DndContext onDragEnd={handleDragEnd}>
          {/* Outside items */}
          <h2 style={{ margin: '16px 0' }}>Outside Items</h2>
          <Droppable id='outside' items={containers.outside} />

          {/* Containers */}
          <h2 style={{ margin: '16px 0' }}>Containers</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {dmedPrescriptionsList?.map((item, ind) => (
              <Droppable key={item.id} id={item.id} items={containers[item.id] || []}>
                {item?.drug_appointment?.medication
                  ?.map((medican) => `${medican?.title} (${medican?.substance_dosage?.dosage}${medican?.substance_dosage?.measurement_unit?.title})`)
                  .join(', ')}
              </Droppable>
            ))}
          </div>
        </DndContext>
      </Box>
      {/* Rest of your dialog footer remains the same */}
      <Box
        display={'flex'}
        sx={{
          bottom: 0,
          right: 0,
          backgroundColor: '#fff',
          left: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
        }}
      >
        <Button onClick={handleClose} color='secondary' variant='contained' fullWidth>
          {t('cancel')}
        </Button>
        <Box width={'20px'} />
        <Button onClick={() => {}} disabled={containers.outside.length} fullWidth>
          {t('continue')}
        </Button>
      </Box>
    </Dialog>
  )
}

export default OrganizeDmedOrder
