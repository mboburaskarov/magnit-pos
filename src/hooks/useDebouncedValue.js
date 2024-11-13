import { useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function useDebouncedValue(defaultValue, delay) {
  const [value, setValue] = useState(defaultValue)
  const [debounceValue] = useDebounce(value, delay)
  return [value, setValue, debounceValue]
}
