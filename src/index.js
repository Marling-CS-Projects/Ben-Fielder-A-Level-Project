//importing libraries
import React from 'react'
import ReactDOM from 'react-dom'

//importing the game
import Game from "./game"

//the css used on the webpage
import "./index.css"

//Rendering the game to the webpage
ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
)
