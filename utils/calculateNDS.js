export const calculateNDS = (price = 0, nds = 0) =>
  parseFloat((price * parseInt(nds)) / (100 + parseInt(nds))).toFixed(2)
