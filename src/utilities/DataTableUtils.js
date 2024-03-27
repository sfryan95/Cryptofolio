// helper functions

export function cash(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num);
}

export function percent(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(num);
}

export function sumColumn(arr, propName) {
  return arr.map((item) => item[propName]).reduce((acc, cur) => acc + cur, 0);
}
