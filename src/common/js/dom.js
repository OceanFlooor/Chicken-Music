export function addClass(el, className) {
  el.classList.add(className)
}

export function hasClass(el, className) {
  return el.classList.contain(className)
}

export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name

  if (val) return el.setAttribute(name, val)
  else return el.getAttribute(name)
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    Moz: 'MozTransform',
    webkit: 'webkitTransfrom',
    O: 'OTransfrom',
    ms: 'msTransfrom',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

// function a(name) {
//   console.log(name)
//   b.apply(a, arguments)
//   console.log(`aaaaaaaaaa`)
// }

// function b(name) {
//   console.log(name)
//   console.log(`this is b`)
// }

// a('222')
