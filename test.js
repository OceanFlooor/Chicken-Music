// 交换a,b
// let a = 1
// let b = 2
// ;[a, b] = [b, a]
// console.log(a, b)

// 数组赋值测试
let a = [1, 2, 3],
  b = a.slice(0),
  c = a // a,c指针指向同一个数组，c改变，a则跟着改变

c.splice(c.length, 0, 999)
console.log(a, c, b)
