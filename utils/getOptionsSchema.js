export default function getOptionsSchema(data, object = false, label = 'label') {
  return object ? { id: data?.id, value: data?.id, [label]: data?.name } : data.map(({ id, name }) => ({ id, value: id, [label]: name }))
}
