//import libraries
import React from "react"
import Phaser from "phaser"
import { IonPhaser } from "@ion-phaser/react"

//import functions from other scripts
import {createNewPlatforms, createFollowCamera, createNewBox, createNewButton, createNewLever, createNewMovingPlatform, createNewSpikeSet, createNewEnemy} from "./components"

//class to initialise the game
class Game2 extends React.Component{
  state = {
    initialize: true,
    //Phaser configuration
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

//variables in use
let playerData
let platformData
let boxData
let buttonData
let leverData
let movingPlatformData
let spikeData
let enemyData
let cameraBounds

let playerPositions
let movingPlatformPositions
let boxPositions
let leverRotations
let enemyPositions

//create function called at the start of the game
function create (){
  //create the players based on data received from game 1
  this.players = this.add.group()
  this.player1 = this.add.rectangle(playerData[0].x, playerData[0].y, 50, 50, 0xff0000)
  this.player2 = this.add.rectangle(playerData[1].x, playerData[1].y, 50, 50, 0xff0000)
  this.players.add(this.player1)
  this.players.add(this.player2)

  //create the platforms based on data from game 1
  this.platforms = this.add.group()
  createNewPlatforms(this, this.platforms, platformData)

  //create the boxes from the data received from game 1
  this.boxes = this.add.group()
  boxData.forEach((box)=>{
    createNewBox(this, this.boxes, {x:box.x,y:box.y,w:33,h:33})
  })

  //create the buttons
  this.buttons = this.add.group()
  buttonData.forEach((button)=>{
    createNewButton(this, this.buttons, {x:button.x,y:button.y,w:button.w,h:button.h})
  })

  //create the levers
  this.levers = this.add.group()
  leverData.forEach((lever)=>{
    createNewLever(this, this.levers, {x:lever.x,y:lever.y,w:lever.w,h:lever.h})
  })

  //create the spikes
  this.spikes = this.add.group()
  spikeData.forEach((spike)=>{
    createNewSpikeSet(this, this.spikes, {x:spike.x,y:spike.y}, spike.count)
  })

  //create the enemies
  this.enemies = this.add.group()
  enemyData.forEach((enemy)=>{
    createNewEnemy(this, this.enemies, {x:enemy.x,y:enemy.y})
  })

  //create the moving platforms
  this.movingPlatforms = this.physics.add.staticGroup()
  movingPlatformData.forEach((movingPlatform)=>{
    createNewMovingPlatform(this, this.movingPlatforms, {x:movingPlatform.x,y:movingPlatform.y,w:movingPlatform.w,h:movingPlatform.h})
  })

  //create the side-scrolling camera
  createFollowCamera(this, this.player1, cameraBounds)
}

//update function is called every frame
function update(){
  //update the players' positions
  for(let i = 0; i < playerPositions.length; i++){
    this.players.children.entries[i].setPosition(playerPositions[i].x, playerPositions[i].y)
  }
  //update moving platform positions
  for(let i = 0; i < movingPlatformPositions.length; i++){
    this.movingPlatforms.children.entries[i].setPosition(movingPlatformPositions[i].x, movingPlatformPositions[i].y)
  }
  //update box positions
  for(let i = 0; i < boxPositions.length; i++){
    this.boxes.children.entries[i].setPosition(boxPositions[i].x, boxPositions[i].y)
  }
  //update the rotation on the levers
  for(let i = 0; i < leverRotations.length; i++){
    this.levers.children.entries[i].setRotation(leverRotations[i].rotation)
  }
  //update the position of the enemies
  for(let i = 0; i < enemyPositions.length; i++){
    this.enemies.children.entries[i].setPosition(enemyPositions[i].x, enemyPositions[i].y)
  }
}

//receiving the player data
export function setPlayerData(playerInfo){
    playerData = playerInfo
}

//receiving the platform data
export function setPlatformData(platformInfo){
    platformData = platformInfo
}

//receiving the box data
export function setBoxData(boxInfo){
    boxData = boxInfo
}

//receiving the button data
export function setButtonData(buttonInfo){
    buttonData = buttonInfo
}

//receiving the lever data
export function setLeverData(leverInfo){
    leverData = leverInfo
}

//receiving the moving platform data
export function setMovingPlatformData(movingPlatformInfo){
    movingPlatformData = movingPlatformInfo
}

//receiving the spike data
export function setSpikeData(spikeInfo){
    spikeData = spikeInfo
}

//receiving the enemy data
export function setEnemyData(enemyInfo){
    enemyData = enemyInfo
}

//receiving the camera data
export function setCameraBounds(bounds){
    cameraBounds = bounds
}

//receiving the positions of the players
export function updatePlayerPositions(data){
    playerPositions = data
}

//receiving the positions of the moving platforms
export function updateMovingPlatformPositions(data){
    movingPlatformPositions = data
}

//receiving the positions of the boxes
export function updateBoxPosition(data){
    boxPositions = data
}

//receiving the rotations of the levers
export function upadateLeverRotation(data){
    leverRotations = data
}

//receiving the positions of the enemies
export function updateEnemyPosition(data){
    enemyPositions = data
}

export default Game2