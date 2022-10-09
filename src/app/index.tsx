import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './components/App'
import PreviewApp from './components/PreviewApp'
import './index.css'

const PREVIEW_ENV = process.env.PREVIEW_ENV
console.log(process.env)
ReactDOM.render(
  !PREVIEW_ENV ? <App /> : <PreviewApp />,
  document.getElementById('react-page')
)
