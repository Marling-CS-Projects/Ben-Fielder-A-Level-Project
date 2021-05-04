import React from "react"
import Phaser from "phaser"
import { IonPhaser } from "@ion-phaser/react"

import {createNewPlatforms, createNewPlayer, createNewKeys} from "./components"
import {handleUserInput} from "./controls"

class Game extends React.Component{
  state = {
    initialize: true,
    game: {
      type: Phaser.AUTO,
      parent: 'phaser-example',
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
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

function create (){
  this.players = this.physics.add.group()

  this.player1 = createNewPlayer(this, this.players, 400, 525)
  this.player2 = createNewPlayer(this, this.players, 500, 525)

  this.platforms = this.physics.add.staticGroup()

  let platformData = [{x:400,y:575,w:800,h:50},{x:100,y:450,w:200,h:50},{x:400,y:310,w:300,h:50},{x:150,y:160,w:150,h:50},
    {x:650,y:200,w:100,h:50},{x:-5,y:300,w:10,h:600},{x:805,y:300,w:10,h:600}]

  createNewPlatforms(this, this.platforms, platformData)

  this.physics.add.collider(this.players, this.platforms)

  createNewKeys(this)
}

function update(){
  handleUserInput(this)
}

export default Game