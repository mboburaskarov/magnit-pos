export default function getOptionsSchema(data, object = false, label = 'label') {
  console.log(data)

  return object ? { value: data?.id, [label]: data?.name } : data.map(({ id, name }) => ({ value: id, [label]: name }))
}
