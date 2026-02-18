export const RAMADAN_TIMES = {
  '19.02.2026': ['05:54', '18:05'],
  '20.02.2026': ['05:53', '18:06'],
  '21.02.2026': ['05:51', '18:07'],
  '22.02.2026': ['05:50', '18:08'],
  '23.02.2026': ['05:49', '18:09'],
  '24.02.2026': ['05:47', '18:10'],
  '25.02.2026': ['05:46', '18:12'],
  '26.02.2026': ['05:44', '18:13'],
  '27.02.2026': ['05:43', '18:14'],
  '28.02.2026': ['05:41', '18:15'],
  '01.03.2026': ['05:40', '18:16'],
  '02.03.2026': ['05:38', '18:18'],
  '03.03.2026': ['05:37', '18:19'],
  '04.03.2026': ['05:35', '18:20'],
  '05.03.2026': ['05:34', '18:21'],
  '06.03.2026': ['05:32', '18:22'],
  '07.03.2026': ['05:31', '18:23'],
  '08.03.2026': ['05:29', '18:25'],
  '09.03.2026': ['05:27', '18:26'],
  '10.03.2026': ['05:26', '18:27'],
  '11.03.2026': ['05:24', '18:28'],
  '12.03.2026': ['05:22', '18:29'],
  '13.03.2026': ['05:21', '18:30'],
  '14.03.2026': ['05:19', '18:31'],
  '15.03.2026': ['05:17', '18:32'],
  '16.03.2026': ['05:15', '18:34'],
  '17.03.2026': ['05:14', '18:35'],
  '18.03.2026': ['05:12', '18:36'],
  '19.03.2026': ['05:10', '18:37'],
  '20.03.2026': ['05:08', '18:38'],
}

export const TASHKENT_DISTRICTS = [
  { id: 'angren', name: 'Angren', saharlikOffset: -3, iftorlikOffset: -7 },
  { id: 'bekobod', name: 'Bekobod', saharlikOffset: -4, iftorlikOffset: 0 },
  { id: 'buka', name: "Bo'ka", saharlikOffset: 1, iftorlikOffset: -1 },
  { id: 'gazalkent', name: "G'azalkent", saharlikOffset: -1, iftorlikOffset: 0 },
  { id: 'olmaliq', name: 'Olmaliq', saharlikOffset: -1, iftorlikOffset: -3 },
  { id: 'parkent', name: 'Parkent', saharlikOffset: -1, iftorlikOffset: -3 },
  { id: 'nurafshon', name: 'Nurafshon', saharlikOffset: -2, iftorlikOffset: -2 },
  { id: 'yangiyol', name: "Yangiyo'l", saharlikOffset: 1, iftorli1kOffset: -1 },
  { id: 'chirchiq', name: 'Chirchiq', saharlikOffset: 1, iftorlikOffset: 1 },
  { id: 'chinoz', name: 'Chinoz', saharlikOffset: 3, iftorlikOffset: 1 },
  { id: 'keles', name: 'Keles', saharlikOffset: 1, iftorlikOffset: 1 },
]

const addOffset = (timeStr, off) => {
  if (!timeStr) return '--:--'
  const [h, m] = timeStr.split(':').map(Number)
  const date = new Date()
  date.setHours(h, m + off, 0, 0)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export const getTimesForDate = (date = new Date(), saharlikOffset = 0, iftorlikOffset = 0) => {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  const key = `${dd}.${mm}.${yyyy}`

  const entry = RAMADAN_TIMES[key]
  if (!entry) return null

  const [saharlik, iftorlik] = entry

  return {
    saharlik: addOffset(saharlik, saharlikOffset),
    iftorlik: addOffset(iftorlik, iftorlikOffset),
    originalSaharlik: saharlik,
    originalIftorlik: iftorlik,
    key,
  }
}

export const getCurrentEvent = (offset = 0) => {
  const now = new Date()
  const todayTimes = getTimesForDate(now, offset, offset)

  if (!todayTimes) return null

  const currentTotal = now.getHours() * 60 + now.getMinutes()

  const [sahH, sahM] = todayTimes.saharlik.split(':').map(Number)
  const saharlikTotal = sahH * 60 + sahM

  const [iftH, iftM] = todayTimes.iftorlik.split(':').map(Number)
  const iftorlikTotal = iftH * 60 + iftM

  if (currentTotal < saharlikTotal) {
    return {
      label: 'Saharlik vaqti',
      time: todayTimes.saharlik,
      targetTime: todayTimes.saharlik,
      type: 'saharlik',
      isNextDay: false,
    }
  } else if (currentTotal < iftorlikTotal) {
    return {
      label: 'Iftorlik vaqti',
      time: todayTimes.iftorlik,
      targetTime: todayTimes.iftorlik,
      type: 'iftorlik',
      isNextDay: false,
    }
  } else {
    // Next event is Saharlik of TOMORROW
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextDayTimes = getTimesForDate(tomorrow, offset, offset)

    // If we run out of dates in RAMADAN_TIMES, handle gracefully
    if (!nextDayTimes) return { label: 'Ramazon tugadi', time: '--:--', targetTime: null }

    return {
      label: 'Saharlik vaqti',
      time: nextDayTimes.saharlik,
      targetTime: nextDayTimes.saharlik,
      type: 'saharlik',
      isNextDay: true,
    }
  }
}

export const getAllDistrictsData = () => {
  const now = new Date()
  return TASHKENT_DISTRICTS.map((district) => {
    const times = getTimesForDate(now, district.saharlikOffset, district.iftorlikOffset)
    return {
      ...district,
      times,
    }
  })
}
