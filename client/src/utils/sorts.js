// export const mapOrder = (originalArray, orderArray, key) => {
//   if (!originalArray || !orderArray || !key) return []
//   return [...originalArray].sort((a, b) => {
//     return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
//   })
// }
export const mapOrder = (array) => {
  if (!array) return []
  return [...array].sort((a, b) => {
    return a.orderIndex - b.orderIndex
  })
}