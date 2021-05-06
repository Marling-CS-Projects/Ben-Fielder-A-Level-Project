import React from "react"
import Phaser from "phaser"
import { IonPhaser } from "@ion-phaser/react"

import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera} from "./components"
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

  let platformData = [{x:800,y:575,w:1600,h:50},{x:-5,y:300,w:10,h:700},{x:1605,y:300,w:10,h:700},
    {x:100,y:450,w:200,h:50},{x:400,y:310,w:300,h:50},{x:150,y:160,w:150,h:50},{x:650,y:200,w:100,h:50},
    {x:850,y:425,w:250,h:50},{x:925,y:300,w:300,h:50},{x:1200,y:175,w:175,h:50},{x:1500,y:375,w:200,h:50}]

  createNewPlatforms(this, this.platforms, platformData)

  this.physics.add.collider(this.players, this.platforms)

  createFollowCamera(this, this.player1)

  createNewKeys(this)
}

function update(){
  handleUserInput(this)
}

export default Game;
