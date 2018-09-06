import {
  TEST
} from './mutations_types'

export default {
  test ({ commit, state }, payload) {
    commit(TEST, payload)
  }
}
