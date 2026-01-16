export default function ifNotEmpty(value, defaultValue) {
  if (value === '') {
    return defaultValue
  }
  return value
}
