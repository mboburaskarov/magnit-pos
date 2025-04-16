const extractNumbers = (marking) => {
  const match = marking.match(/010(\d+)21/)
  return match ? match[1] : null
}
export default extractNumbers
