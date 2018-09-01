import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './components/App'
import './index.css'

function renderApp(CurrentApp: typeof App) {
  ReactDOM.render(<CurrentApp />, document.getElementById('root'))
}

// Initial render
renderApp(App)

// Connect HMR
if ((module as any).hot) {
  (module as any).hot.accept(['./components/App'], () => {
    // Componenent definition changed, re-render app
    renderApp(App)
  })
}
