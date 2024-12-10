import { Box, Button } from '@mui/material'
import ForwardArrow from '../../../src/assets/icons/ForwardArrow'
import { useIMask } from 'react-imask'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import dayjs from 'dayjs'
import TextField from '../TextField'

export default function DateRangeInputsBox({ dateState }) {
  const { ref: DD_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: MM_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: YYYY_number_ref } = useIMask({ mask: '0000', lazy: true, placeholderChar: '' })
  const { ref: DD_end_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: MM_end_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: YYYY_end_number_ref } = useIMask({ mask: '0000', lazy: true, placeholderChar: '' })
  const { reset } = useFormContext()

  useEffect(() => {
    if (dateState?.from && dateState?.to) {
      const from_day = dayjs(dateState?.from).format('DD')
      const from_month = dayjs(dateState?.from).format('MM')
      const from_year = dayjs(dateState?.from).format('YYYY')
      const to_day = dayjs(dateState?.to).format('DD')
      const to_month = dayjs(dateState?.to).format('MM')
      const to_year = dayjs(dateState?.to).format('YYYY')
      reset({ from_day, from_month, from_year, to_day, to_month, to_year })
    }
  }, [dateState])

  return (
    <Box width='100%' sx={(theme) => ({ display: 'flex', justifyContent: 'center', borderTop: `2px solid ${theme.palette.gray[200]}` })} py={3} px={3}>
      <Box display='flex' alignItems='center'>
        <Box flexGrow='50%'>
          <Box columnGap={1} display='flex'>
            <Box width={60}>
              <TextField inputRef={DD_number_ref} centerMode id='from_day' name='from_day' placeholder='ДД' fullWidth required />
            </Box>
            <Box width={60}>
              <TextField inputRef={MM_number_ref} centerMode id='from_month' name='from_month' placeholder='ММ' fullWidth required />
            </Box>
            <Box width={72}>
              <TextField centerMode inputRef={YYYY_number_ref} id='from_year' name='from_year' placeholder='ГГГГ' fullWidth required />
            </Box>
          </Box>
        </Box>
        <Box width={48} display='flex' alignItems='center' justifyContent='center'>
          <ForwardArrow fill='#bdbdbd' />
        </Box>
        <Box flexGrow='50%' mr={4}>
          <Box columnGap={1} display='flex'>
            <Box width={60}>
              <TextField inputRef={DD_end_number_ref} centerMode id='to_day' name='to_day' placeholder='ДД' fullWidth required />
            </Box>
            <Box width={60}>
              <TextField inputRef={MM_end_number_ref} centerMode id='to_month' name='to_month' placeholder='ММ' fullWidth required />
            </Box>
            <Box width={72}>
              <TextField inputRef={YYYY_end_number_ref} centerMode id='to_year' name='to_year' placeholder='ГГГГ' fullWidth required />
            </Box>
          </Box>
        </Box>
      </Box>

      <Button primary type='submit'>
        Применить
      </Button>
    </Box>
  )
}
