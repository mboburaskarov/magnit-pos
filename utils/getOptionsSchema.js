export default function getOptionsSchema(data) {
  return data.map(({ id, name }) => ({ value: id, label: name }))
}
