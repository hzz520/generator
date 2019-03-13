import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'

import router from './router'
import stores from './store'

render(
  <Provider {...stores}>
    {router}
  </Provider>,
  document.getElementById('app')
)