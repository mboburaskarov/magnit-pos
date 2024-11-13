export default function arrayMove(array, from, to, key) {
  array = array.slice()
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0])
  return key ? array?.map((el, index) => ({ ...el, [key]: index })) : array
}
