const countries = [
  {
    name: '🇺🇿 Узбекистан (+998)',
    flag: '🇺🇿',
    code: 'UZ',
    dial_code: '+998',
    mask: '+\\9\\9\\8 99 999 99 99',
  },
  {
    name: '🇰🇿 Казахстан (+7)',
    flag: '🇰🇿',
    code: 'KZ',
    dial_code: '+77',
    mask: `+\\7 999 999 99 99`,
  },
  {
    name: '🇬🇪 Georgia (+995)',
    flag: '🇬🇪',
    code: 'GE',
    dial_code: '+995',
    mask: '+\\9\\9\\5 999 999 999',
  },
  {
    name: '🇰🇬 Kyrgyzstan (+996)',
    flag: '🇰🇬',
    code: 'KG',
    dial_code: '+996',
    mask: `+\\9\\9\\6 999 999 999`,
  },
  {
    name: '🇹🇯 Таджикистан (+992)',
    flag: '🇹🇯',
    code: 'TJ',
    dial_code: '+992',
    mask: '+\\9\\9\\2 99 999 99 99',
  },
]

export const formatPhoneNumber = (phone_number) => {
  const phoneNumberCountry = countries?.find((el) => phone_number?.startsWith(el.dial_code)) || countries[0]

  function format(value, pattern) {
    let i = 0
    const v = value?.toString()
    return pattern?.replace(/#/g, () => v[i++])
  }

  const formattedMask = phoneNumberCountry?.mask
    ?.replaceAll('\\', '')
    ?.replace('+', '')
    ?.replace(/[0-9]/gi, () => '#')

  const formattedPhoneNumber = '+' + format(phone_number?.replace('+', ''), formattedMask)

  return formattedPhoneNumber
}
