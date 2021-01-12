function toDouble(value) {
  if (value < 10) {
    return '0' + value
  }
  return value
}

// 保留n位小数点,不四舍五入
export const f = (value, n = 2) => {
  value = parseFloat(value)
  let str = ''
  if (value) {
    const index = String(value).indexOf('.')
    if (index > 0) {
      const arr = String(value).split('.')
      if (arr[1].length >= n) {
        str = `${arr[0]}.${arr[1].slice(0, n)}`
      } else {
        str = value.toFixed(n)
      }
    } else {
      str = value.toFixed(n)
    }
    return str
  } else {
    return '0.00'
  }
}

// 时间格式化
export const time = (time, separator = '.', showHourAndMin = true) => {
  if (time) {
    let d = new Date(time)
    let day = d.getDate()
    let month = d.getMonth() + 1
    let year = d.getFullYear()
    let hours = d.getHours()
    let min = d.getMinutes()
    let str = year + separator + toDouble(month) + separator + toDouble(day)
    if (showHourAndMin) {
      str += ' ' + toDouble(hours) + ':' + toDouble(min)
    }
    return str
  } else {
    return '- -'
  }
}
