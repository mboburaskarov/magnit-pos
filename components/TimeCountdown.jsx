import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

function updateCountdown({ endDate, doneAt, onlyShow, moreDay }) {
  const endTime = dayjs(endDate)
  const nowTime = onlyShow ? dayjs(doneAt) : dayjs()
  const difference = nowTime.diff(endTime)
  const formattedTime = moreDay ? dayjs.duration(difference).format('DD:HH:mm') : dayjs.duration(difference).format('HH:mm:ss')
  const isNegative = difference < 0
  const output = (isNegative ? '-' : '+') + formattedTime.replaceAll('-', '')
  const differenceInMinutes = nowTime.diff(endTime, 'minutes')
  const color = differenceInMinutes > -10 ? 'red' : differenceInMinutes > -30 ? 'yellow' : 'green'
  const onlyShowColor = differenceInMinutes > 0 ? 'red' : 'green'
  return { time: output, color: onlyShow ? onlyShowColor : color }
}

export default function TimeCountdown({ endTime, doneAt, onlyShow = false, moreDay = false }) {
  const [formattedTime, setFormattedTime] = useState({ time: '00:00:00', color: 'green' })

  useEffect(() => {
    if (!onlyShow) {
      const interval = setInterval(() => {
        setFormattedTime(updateCountdown({ endDate: endTime, onlyShow, doneAt: doneAt, moreDay }))
      }, 1000)

      return () => clearInterval(interval)
    } else {
      setFormattedTime(updateCountdown({ endDate: endTime, doneAt: doneAt, onlyShow }))
    }
  }, [])

  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      width={moreDay ? 116 : 96}
      height={34}
      bgcolor={`${formattedTime.color}.50`}
      borderRadius={3}
      border='1px solid'
      borderColor={`${formattedTime.color}.500`}
      color={`${formattedTime.color}.500`}
      fontSize={14}
    >
      {formattedTime.time}
    </Box>
  )
}
