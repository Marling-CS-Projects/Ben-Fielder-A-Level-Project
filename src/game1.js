//importing libraries
import React from "react"
import Phaser from "phaser"
import { IonPhaser } from "@ion-phaser/react"

//importing functions from my other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform, createNewBox, createNewButton, createNewLever, createNewSpikeSet, createNewEnemy, createNewExitDoor, createNewFinishPlatform} from "./components"
import {handleUserInput, checkInteractionKeyPress} from "./controls"
import {checkEnemyDistanceToPlayer, moveEnemies, moveExitDoor, moveFinishPlatformBody, moveMovingPlatforms, resetBoxVelocity, resetButtonValues} from "./frame-events"
import {handleButtonPress, handleEnemyCollision, handleExitDoorCollision, handleLeverPress, handleSpikeCollision, setSafePlayerPosition} from "./collision-events"

//import functions from game 2 in order to communicate with it
import { setBoxData, setButtonData, setCameraBounds, setEnemyData, setExitDoorData, setLeverData, setMovingPlatformData, setPlatformData, setPlayerData, setSpikeData, upadateLeverRotation, updateBoxPosition, updateEnemyPosition, updateExitDoorPosition, updateMovingPlatformPositions, updatePlayerPositions } from "./game2"


//The class to render the Phaser game
class Game1 extends React.Component{
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
  //create the players for the level
  this.players = this.physics.add.group()
  this.player1 = createNewPlayer(this, this.players, 800, 725)
  this.player2 = createNewPlayer(this, this.players, 3100, 125)

  //send player data to game 2
  setPlayerData([{x:1000,y:500},{x:3100,y:125}])

  //the platforms physics group
  this.platforms = this.physics.add.staticGroup()
  let platformData = [{x:1600,y:775,w:3200,h:50},{x:-5,y:400,w:10,h:1000},{x:3205,y:400,w:10,h:1000},
    {x:1600,y:200,w:50,h:600},{x:150,y:550,w:300,h:50},{x:150,y:250,w:300,h:50},{x:1250,y:650,w:150,h:50},
    {x:1450,y:510,w:100,h:50},{x:1200,y:450,w:175,h:50},{x:800,y:100,w:50,h:200},
    {x:3100,y:175,w:200,h:50},{x:2700,y:300,w:200,h:50},{x:2900,y:425,w:600,h:50},{x:2000,y:425,w:800,h:50}]

  //Creating the platforms and attaching them to the platforms physics group
  createNewPlatforms(this, this.platforms, platformData)

  //send the platform data to game 2
  setPlatformData(platformData)

  //setting collider between the platforms and players which also sets a safe player position
  this.physics.add.collider(this.players, this.platforms, setSafePlayerPosition)

  //create the boxes for the level
  this.boxes = this.physics.add.group()
  this.box1 = createNewBox(this, this.boxes, {x:180,y:500,w:33,h:33})
  this.box2 = createNewBox(this, this.boxes, {x:2700,y:250,w:33,h:33})

  //send the box data to game 2
  setBoxData([{x:180,y:500,w:33,h:33},{x:2700,y:250,w:33,h:33}])

  //Setting colliders for boxes
  this.physics.add.collider(this.players, this.boxes)
  this.physics.add.collider(this.platforms, this.boxes)
  this.physics.add.collider(this.boxes, this.boxes)

  //create the buttons for use in the scene
  this.buttons = this.physics.add.staticGroup()
  this.button1 = createNewButton(this, this.buttons, {x:950,y:750,w:25,h:10})
  this.button2 = createNewButton(this, this.buttons, {x:100,y:525,w:25,h:10})
  this.button3 = createNewButton(this, this.buttons, {x:125,y:225,w:25,h:10})
  this.button4 = createNewButton(this, this.buttons, {x:1800,y:400,w:25,h:10})

  //send the button data to game 2
  setButtonData([{x:950,y:750,w:25,h:10},{x:100,y:525,w:25,h:10},{x:125,y:225,w:25,h:10},{x:1800,y:400,w:25,h:10}])

  //setting the colliders that trigger an event when a button is pressed
  this.physics.add.overlap(this.players, this.buttons, handleButtonPress)
  this.physics.add.overlap(this.boxes, this.buttons, handleButtonPress)

  //create the levers for use in the level
  this.levers = this.physics.add.staticGroup()
  this.lever1 = createNewLever(this, this.levers, {x:700,y:750,w:50,h:10})
  this.lever2 = createNewLever(this, this.levers, {x:3150,y:150,w:50,h:10})
  this.lever3 = createNewLever(this, this.levers, {x:1800,y:750,w:50,h:10})

  //send the lever data to game 2
  setLeverData([{x:700,y:750,w:50,h:10},{x:3150,y:150,w:50,h:10},{x:1800,y:750,w:50,h:10}])

  //setting collsion event between players and levers
  this.physics.add.overlap(this.players, this.levers, handleLeverPress)

  //create the spikes for use in the level
  this.spikes = this.physics.add.staticGroup()
  createNewSpikeSet(this, this.spikes, {x:0,y:750}, 14)
  createNewSpikeSet(this, this.spikes, {x:2100,y:750}, 40)

  //send the spike data to game 2
  setSpikeData([{x:0,y:750,count:14},{x:2100,y:750,count:40}])

  //setting the colliders for colliders for spikes
  this.physics.add.collider(this.players, this.spikes, handleSpikeCollision)
  this.physics.add.collider(this.boxes, this.spikes)

  //create the enemies for the level
  this.enemies = this.physics.add.group()
  this.enemy1 = createNewEnemy(this, this.enemies, {x:1200,y:725}, 1500, 50)
  this.enemy2 = createNewEnemy(this, this.enemies, {x:2000,y:375}, 2400, 50)

  //send the enemy data to game 2
  setEnemyData([{x:1200,y:725},{x:2000,y:375}])

  //set colliders for enemies including an event for between players and enemies
  this.physics.add.collider(this.enemies, this.platforms)
  this.physics.add.overlap(this.players, this.enemies, handleEnemyCollision)
  this.physics.add.overlap(this.enemies, this.buttons, handleButtonPress)

  this.movingPlatforms = this.physics.add.group()
  this.finishPlatforms = this.physics.add.group()

  this.finishPlatformBody = createNewMovingPlatform(this, this.movingPlatforms, {x:950,y:100,w:200,h:50}, {x:950,y:100}, {x:0,y:0}, null)
  this.finishPlatform = createNewFinishPlatform(this, this.finishPlatforms, {x:950,y:100,w:200,h:50}, this.finishPlatformBody)

  this.physics.add.collider(this.finishPlatforms, this.movingPlatforms)

  //create the moving platforms for use in the level
  this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:1600,y:625,w:50,h:250}, {x:1600,y:500}, {x:0,y:-1}, this.button1)
  this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:500,y:725,w:200,h:50}, {x:500,y:550}, {x:0,y:-1}, this.lever2)
  this.movingPlatform3 = createNewMovingPlatform(this, this.movingPlatforms, {x:500,y:450,w:200,h:50}, {x:500,y:250}, {x:0,y:-1}, this.button2)
  this.movingPlatform4 = createNewMovingPlatform(this, this.movingPlatforms, {x:760,y:200,w:150,h:50}, {x:800,y:500}, {x:0,y:1}, this.button1)
  this.movingPlatform5 = createNewMovingPlatform(this, this.movingPlatforms, {x:890,y:650,w:50,h:200}, {x:890,y:450}, {x:0,y:-1}, this.lever3)
  this.movingPlatform6 = createNewMovingPlatform(this, this.movingPlatforms, {x:1010,y:650,w:50,h:200}, {x:1010,y:450}, {x:0,y:-1}, this.lever1)
  this.movingPlatform7 = createNewMovingPlatform(this, this.movingPlatforms, {x:2500,y:425,w:200,h:50}, {x:2700,y:700}, {x:1,y:0}, this.button4)
  this.movingPlatform8 = createNewMovingPlatform(this, this.movingPlatforms, {x:2600,y:500,w:200,h:50}, {x:2100,y:750}, {x:-1,y:0.5}, this.button3)
  this.movingPlatform9 = createNewMovingPlatform(this, this.movingPlatforms, {x:950,y:150,w:200,h:50}, {x:1250,y:150}, {x:1,y:0}, this.button1)

  //send the moving platformm data to game 2
  setMovingPlatformData([{x:950,y:100,w:200,h:50},{x:1600,y:625,w:50,h:250},{x:500,y:725,w:200,h:50},{x:500,y:450,w:200,h:50},{x:760,y:200,w:150,h:50},{x:890,y:650,w:50,h:200},{x:1010,y:650,w:50,h:200},{x:2500,y:425,w:200,h:50},{x:2600,y:500,w:200,h:50},{x:950,y:150,w:200,h:50}])

  //setting colliders
  this.physics.add.collider(this.players, this.movingPlatforms)
  this.physics.add.collider(this.movingPlatforms, this.boxes)
  this.physics.add.collider(this.movingPlatforms, this.movingPlatforms)

  //create the exit door
  this.exitDoors = this.physics.add.group()
  this.exitDoor = createNewExitDoor(this, this.exitDoors, {x:950,y:100}, this.finishPlatform)

  //send the exit door data to game 2
  setExitDoorData([{x:950,y:100,floor:this.finishPlatform}])

  //add overlap between the players and exit door
  this.physics.add.overlap(this.players, this.exitDoors, handleExitDoorCollision)

  //making a side-scrolling camera to follow the player
  createFollowCamera(this, this.player2, {x1:0,y1:0,x2:3200,y2:800})

  //create the side-scrolling camera and set the bounds
  setCameraBounds({x1:0,y1:0,x2:3200,y2:800})

  //making the varibles to listen to key presses
  createNewKeys(this)
}

//update function called every frame
function update(){
  //functions to manage the level
  handleUserInput(this)
  moveMovingPlatforms(this)
  resetButtonValues(this)
  resetBoxVelocity(this)
  checkInteractionKeyPress(this)
  checkEnemyDistanceToPlayer(this)
  moveEnemies(this)
  moveExitDoor(this)
  moveFinishPlatformBody(this.finishPlatform)

  //functions to send data to game 2
  updatePlayerPositions(this.players.children.entries)
  updateMovingPlatformPositions(this.movingPlatforms.children.entries)
  updateBoxPosition(this.boxes.children.entries)
  upadateLeverRotation(this.levers.children.entries)
  updateEnemyPosition(this.enemies.children.entries)
  updateExitDoorPosition(this.exitDoors.children.entries)
}

export default Game1