function getRandomInt(min, max) {
  // 在max和min之间产生随机数，包括上限和下限
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 洗牌函数，金典算法
export function shuffle(arr) {
  const _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandomInt(0, i)
    const t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 节流函数，避免输入随即查询
export function debounce(func, delay) {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
