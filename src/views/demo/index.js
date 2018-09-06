/* eslint-disable no-new */
import { fun } from './data'

const fn = (a) => {
  console.log(111, a)
}

fn(111)

fun(333)

let a = new Promise((resolve, reject) => {
  resolve({ a: 666 })
})

a.then(data => {
  console.log(data)
}).catch(err => {
  console.log(err)
})

let number = [1, 2, 3]
let dou = number.map(number => number * 2)

console.log(dou)

class A extends Object {
  constructor (props) {
    super(props)
    this.state = {
      todolist: 123
    }
  }
  todo () {
    console.log(this.state)
    return this
  }
}

@fn
class B extends A {
  constructor (props) {
    super(props)
    this.state = {
      todolist: 666,
      list: 999
    }
  }
  todo () {
    this.state.list = 111
    console.log(this.state)
    return this
  }
}

let b = new A()
let c = new B()
console.log(b, c)

new Set([1, 1, 2, 3])

const afn = (a) => {
  setTimeout(() => {
    console.log(a)
  }, 1000)
  return a
}

async function asynfn (d) {
  let a = await afn(d + 1)
  console.log(d, a)
}

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 }
console.log(x, y, z)

asynfn(11)
