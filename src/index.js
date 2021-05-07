import React from 'react'
import ReactDOM from 'react-dom'
import Game1 from './game1'
import Game2 from './game2'

import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <Game1 />
    <Game2 />
  </React.StrictMode>,
  document.getElementById('root')
)
