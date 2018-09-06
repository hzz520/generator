import {
  TEST
} from './mutations_types'

export default {
  [TEST] (state, payload) {
    state.test = payload
  }
}
