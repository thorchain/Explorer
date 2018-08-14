import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore } from '..'
import App from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const store = createStore({})
  ReactDOM.render(<App store={store} />, div)
  ReactDOM.unmountComponentAtNode(div)
})
