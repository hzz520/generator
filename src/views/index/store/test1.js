import { observable, action } from 'mobx'

class Test {
  @observable demo2 = 666
  @observable demo3 = 999

  @action async changeDemo2 (payload) {
    self.demo2 = payload
  }
  @action async changeDemo3 (payload) {
    self.demo3 = payload
  }
}

let self = new Test()

export default self
