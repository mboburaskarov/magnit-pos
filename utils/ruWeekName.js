const weeknameMap = {
  Mon: 'Пн',
  Tue: 'Вт',
  Wed: 'Ср',
  Thu: 'Чт',
  Fri: 'Пт',
  Sat: 'Сб',
  Sun: 'Вс',
}

export const translatedWeekNameRu = (weekname) => {
  console.log(weekname)

  return weeknameMap[weekname] || weekname
}
