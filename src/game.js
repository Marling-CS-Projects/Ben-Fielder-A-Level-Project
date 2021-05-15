//importing libraries
import React from "react"
import Phaser from "phaser"
import { IonPhaser } from "@ion-phaser/react"

//importing functions from my other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform, createNewBox, createNewButton, createNewLever} from "./components"
import {handleUserInput, checkInteractionKeyPress} from "./controls"
import {moveMovingPlatforms, resetBoxVelocity, resetButtonValues} from "./frame-events"
import {handleButtonPress, handleLeverPress} from "./collision-events"


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
  //return the Phaser game in jsx
  render(){
    const { initialize, game } = this.state
    return(
      <IonPhaser game={game} initialize={initialize} />
    )
  }
}

//create function called once by Phaser game object
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

  //setting collider between the platforms and players
  this.physics.add.collider(this.players, this.platforms)

  //creating boxes physics group and 2 boxes
  this.boxes = this.physics.add.group()
  this.box1 = createNewBox(this, this.boxes, {x:600,y:525,w:33,h:33})
  this.box2 = createNewBox(this, this.boxes, {x:600,y:160,w:33,h:33})

  //Setting colliders for boxes
  this.physics.add.collider(this.players, this.boxes)
  this.physics.add.collider(this.platforms, this.boxes)
  this.physics.add.collider(this.boxes, this.boxes)

  //setting the buttons physics group and creating a button
  this.buttons = this.physics.add.staticGroup()
  this.button = createNewButton(this, this.buttons, {x:650,y:175,w:25,h:10})

  //setting the colliders that trigger an event when a button is pressed
  this.physics.add.collider(this.players, this.buttons, handleButtonPress)
  this.physics.add.overlap(this.boxes, this.buttons, handleButtonPress)

  //creating levers physics group and a lever
  this.levers = this.physics.add.staticGroup()
  this.lever = createNewLever(this, this.levers, {x:250,y:550,w:50,h:10})

  //setting collsion event between players and levers
  this.physics.add.overlap(this.players, this.levers, handleLeverPress)

  //moving platforms physics group and 2 moving platforms
  this.movingPlatforms = this.physics.add.group()
  this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:900,y:175,w:200,h:50}, {x:1250,y:175}, {x:1,y:0}, this.button)
  this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:100,y:525,w:200,h:50}, {x:100,y:325}, {x:0,y:-1}, this.lever)

  //setting colliders
  this.physics.add.collider(this.players, this.movingPlatforms)
  this.physics.add.collider(this.movingPlatforms, this.boxes)

  //making a side-scrolling camera to follow the player
  createFollowCamera(this, this.player1)

  //making the varibles to listen to key presses
  createNewKeys(this)

}

//update function called every frame
function update(){
  handleUserInput(this)
  moveMovingPlatforms(this)
  resetButtonValues(this)
  resetBoxVelocity(this)
  checkInteractionKeyPress(this)
}

export default Game