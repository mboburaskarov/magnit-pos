import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIMask } from 'react-imask'
import StyledTooltip from '../../StyledTooltip'
import TextField from '../TextField'

export default function DateRangeInputsBox({ dateState }) {
  const { ref: DD_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: HH_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: mm_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: MM_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: YYYY_number_ref } = useIMask({ mask: '0000', lazy: true, placeholderChar: '' })
  const { ref: DD_end_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: HH_end_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: mm_end_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: MM_end_number_ref } = useIMask({ mask: '00', lazy: true, placeholderChar: '' })
  const { ref: YYYY_end_number_ref } = useIMask({ mask: '0000', lazy: true, placeholderChar: '' })
  const { reset } = useFormContext()
  const [showTime, setShowTime] = useState(false)
  useEffect(() => {
    if (dateState?.from && dateState?.to) {
      const from_day = dayjs(dateState?.from).format('DD')
      const from_month = dayjs(dateState?.from).format('MM')
      const from_year = dayjs(dateState?.from).format('YYYY')
      const to_day = dayjs(dateState?.to).format('DD')
      const to_month = dayjs(dateState?.to).format('MM')
      const to_year = dayjs(dateState?.to).format('YYYY')
      const from_hour = dateState?.from_time?.split(':')[0] || '00'
      const from_minute = dateState?.from_time?.split(':')[1] || '00'
      const to_minute = dateState?.to_time?.split(':')[1] || '59'
      const to_hour = dateState?.to_time?.split(':')[0] || '23'
      reset({ from_day, from_month, from_year, to_day, to_month, to_year, from_hour, from_minute, to_minute, to_hour })
    }
  }, [dateState])

  return (
    <Box
      width='100%'
      sx={(theme) => ({ display: 'flex', justifyContent: 'center', backgroundColor: theme.palette.background.default, borderRadius: '16px' })}
      py={3}
      px={3}
    >
      <Box
        display='flex'
        alignItems='center'
        sx={{
          '& .MuiOutlinedInput-root:hover': {
            bgcolor: 'bunker.100',
          },
        }}
      >
        <StyledTooltip title={'Нажмите, чтобы добавить временной фильтр'}>
          <Box mr={2} display={'flex'} flexDirection={'column'} alignItems={'center'} onClick={() => setShowTime((p) => !p)}>
            {/* <AccessTime sx={{ fontSize: 40, color: '#111111' }} /> */}
            {!showTime ? <ExpandMore sx={{ fontSize: 40, color: '#111111' }} /> : <ExpandLess sx={{ fontSize: 40, color: '#111111' }} />}
          </Box>
        </StyledTooltip>
        <Box display='flex' flexDirection={'column'} alignItems='center'>
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
          <Box display={showTime ? 'flex' : 'none'} flexGrow='50%' mt={'10px'}>
            <Box columnGap={1} alignItems={'center'} display='flex'>
              <Box width={60}>
                <TextField
                  onFocus={(e) => {
                    if (e?.target?.value == '00') {
                      HH_number_ref.current.value = ''
                    }
                  }}
                  onBlur={(e) => {
                    if (e?.target?.value == '') {
                      HH_number_ref.current.value = '00'
                    }
                  }}
                  inputRef={HH_number_ref}
                  centerMode
                  id='from_hour'
                  name='from_hour'
                  placeholder='ЦЦ'
                  fullWidth
                  required
                />
              </Box>
              <Typography>:</Typography>
              <Box width={60}>
                <TextField
                  onFocus={(e) => {
                    if (e?.target?.value == '00') {
                      mm_number_ref.current.value = ''
                    }
                  }}
                  onBlur={(e) => {
                    if (e?.target?.value == '') {
                      mm_number_ref.current.value = '00'
                    }
                  }}
                  inputRef={mm_number_ref}
                  centerMode
                  id='from_minute'
                  name='from_minute'
                  placeholder='ММ'
                  fullWidth
                  required
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          width={48}
          m={'0 10px'}
          sx={{
            '& > svg': {
              fontSize: '20px',
            },
          }}
          display='flex'
          flexDirection={'column'}
          alignItems='center'
          justifyContent='center'
        >
          {/* <ForwardArrow fill='#bdbdbd' /> */}
          <Typography>до</Typography>

          {/* <ArrowiconUp /> */}
        </Box>
        <Box display='flex' flexDirection={'column'} alignItems='center'>
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
          <Box flexGrow='50%' mt={'10px'}>
            <Box display={showTime ? 'flex' : 'none'} columnGap={1} alignItems={'center'}>
              <Box width={60}>
                <TextField
                  onFocus={(e) => {
                    if (e?.target?.value == '23') {
                      HH_end_number_ref.current.value = ''
                    }
                  }}
                  onBlur={(e) => {
                    if (e?.target?.value == '') {
                      HH_end_number_ref.current.value = 23
                    }
                  }}
                  inputRef={HH_end_number_ref}
                  centerMode
                  id='to_hour'
                  name='to_hour'
                  placeholder='ЦЦ'
                  fullWidth
                  required
                />
              </Box>
              <Typography>:</Typography>
              <Box width={60}>
                <TextField
                  onFocus={(e) => {
                    if (e?.target?.value == '59') {
                      mm_end_number_ref.current.value = ''
                    }
                  }}
                  onBlur={(e) => {
                    if (e?.target?.value == '') {
                      mm_end_number_ref.current.value = 59
                    }
                  }}
                  inputRef={mm_end_number_ref}
                  centerMode
                  id='to_minute'
                  name='to_minute'
                  placeholder='ММ'
                  fullWidth
                  required
                />
              </Box>
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
