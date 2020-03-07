function randomIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(_arr) {
  let arr = [..._arr]
  for (let i = 0; i < arr.length; i++) {
    let k = randomIndex(i, arr.length - 1)
    arr[i] = [arr[k], (arr[k] = arr[i])][0]
  }
  return arr
}

// 箭头函数不绑定Arguments 对象
export function debounce(_func, _await) {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      _func(...args)
      // _func.call(this, ...args)
    }, _await)
  }
}

// function print(fn) {
//   const a = 200
//   fn()
// }
// const a = 100
// print(() => {
//   console.log(a)
// })
