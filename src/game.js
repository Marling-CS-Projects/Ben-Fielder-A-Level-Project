//importing libraries
import React from "react"
import Phaser from "phaser"
import { IonPhaser } from "@ion-phaser/react"

//importing functions from my other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform} from "./components"
import {handleUserInput} from "./controls"
import {moveMovingPlatforms} from "./frame-events"


//The class to render the Phaser game
class Game extends React.Component{
  //Phaser configuration
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
  //return the Phaser game in jsx form
  render(){
    const { initialize, game } = this.state
    return(
      <IonPhaser game={game} initialize={initialize} />
    )
  }
}

//create function called by Phaser game object
function create (){
  //creating the players physics group and a player
  this.players = this.physics.add.group()
  this.player1 = createNewPlayer(this, this.players, 400, 525)

  //the platforms physics group
  this.platforms = this.physics.add.staticGroup()

  let platformData = [{x:800,y:575,w:1600,h:50},{x:-5,y:300,w:10,h:700},{x:1605,y:300,w:10,h:700},
    {x:400,y:310,w:300,h:50},{x:150,y:160,w:150,h:50},{x:650,y:200,w:100,h:50},
    {x:850,y:425,w:250,h:50},{x:1150,y:375,w:175,h:50},{x:1500,y:200,w:200,h:50}];

  //Creating the platforms and attaching them to the platforms physics group
  createNewPlatforms(this, this.platforms, platformData)

  //setting a collider
  this.physics.add.collider(this.players, this.platforms)

  //moving platforms physics group
  this.movingPlatforms = this.physics.add.group()

  //creating moving platforms
  this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:900,y:175,w:200,h:50}, {x:1250,y:175}, {x:1,y:0})
  this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:100,y:525,w:200,h:50}, {x:100,y:325}, {x:0,y:-1})

  //setting a collider
  this.physics.add.collider(this.players, this.movingPlatforms)

  //making a side-scrolling camera to follow the player
  createFollowCamera(this, this.player1)

  //making the varibles to listen to key presses
  createNewKeys(this)
}

//update function called every frame
function update(){
  handleUserInput(this)
  moveMovingPlatforms(this)
}

export default Game