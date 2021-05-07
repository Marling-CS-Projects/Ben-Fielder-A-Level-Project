import React from "react"
import Phaser from "phaser"
import { IonPhaser } from "@ion-phaser/react"

import {createNewPlatforms, createFollowCamera} from "./components"

class Game2 extends React.Component{
  state = {
    initialize: true,
    game: {
      type: Phaser.AUTO,
      parent: 'phaser-example',
      width: 800,
      height: 600,
      scene: {
        create: create,
        update: update
      }
    }
  }
  render(){
    const { initialize, game } = this.state
    return(
      <IonPhaser game={game} initialize={initialize} />
    )
  }
}

let p1x
let p1y
let p2x
let p2y

let platformData

function create (){
  this.player1 = this.add.rectangle(400, 525, 50, 50, 0xff0000)
  this.player2 = this.add.rectangle(500, 525, 50, 50, 0xff0000)

  this.platforms = this.add.group()
  createNewPlatforms(this, this.platforms, platformData)

  createFollowCamera(this, this.player1)
}

function update(){
  this.player1.setPosition(p1x, p1y)
  this.player2.setPosition(p2x, p2y)
}

export function updatePlayerPositions(player1, player2){
    p1x = player1.x
    p1y = player1.y
    p2x = player2.x
    p2y = player2.y
}

export function setPlatformData(platformInfo){
    platformData = platformInfo
}

export default Game2