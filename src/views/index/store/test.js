import { observable, action } from 'mobx'

class Test {
  @observable demo = 111
  @observable demo1 = 999

  @action async changeDemo (payload) {
    self.demo = payload
  }
  @action async changeDemo1 (payload) {
    self.demo1 = payload
  }
}

// export default new Test()
const self = new Test()
export default self
