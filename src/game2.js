//importing libraries
import React from "react"
import Phaser from "phaser"
import {IonPhaser} from "@ion-phaser/react"

//import functions from other scripts
import {createNewPlatforms, createFollowCamera, createNewBox, createNewButton, createNewLever, createNewMovingPlatform, createNewSpikeSet, createNewEnemy, createNewExitDoor} from "./levels/components/components"

/***  This is the puppet game which is controlled
****  by game1. It is restarted every time the scene
****  is changed in game1. It is designed so that only
*///  1 scene will ever be needed as it is controlled

//class to initialise the game
class Game2 extends React.Component{
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
    render(){
        const { initialize, game } = this.state
        return(
            //returning the Phaser game as a jsx component
            <IonPhaser game={game} initialize={initialize} />
        )
    }
}

//variables for getting data on how to create each element
let playerData, platformData, boxData, buttonData, leverData, movingPlatformData, spikeData, enemyData, exitDoorData, cameraBounds

//variable for getting data on how to update each element
let playerPositions, movingPlatformPositions, boxPositions, leverRotations, enemyPositions, exitDoorPositions

//variable to store data about traps
let trapPlatforms

//variables to tell the scene when to run
let restart
let ready

//create function called at the start of the game
function create (){
    restart = false
    if(!ready){return}

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

    //create the exit doors
    this.exitDoors = this.physics.add.staticGroup()
    exitDoorData.forEach((exitDoor)=>{
        createNewExitDoor(this, this.exitDoors, {x:exitDoor.x,y:exitDoor.y}, exitDoor.floor)
    })

    //create the side-scrolling camera
    createFollowCamera(this, this.player1, cameraBounds)
}

//update function is called every frame
function update(){
    if(restart){
        this.scene.restart()
        return
    }
    if(!ready){return}

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
    //update posititions for exit doors
    for(let i = 0; i < exitDoorPositions.length; i++){
        this.exitDoors.children.entries[i].setPosition(exitDoorPositions[i].x, exitDoorPositions[i].y)
    }

    if(trapPlatforms){
        createNewPlatforms(this, this.platforms, trapPlatforms)
        trapPlatforms = null
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

//receiving the exit door data
export function setExitDoorData(exitDoorInfo){
    exitDoorData = exitDoorInfo
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

//receiving the exit door position
export function updateExitDoorPosition(data){
    exitDoorPositions = data
}

//receiveing data about the platforms to create after a trap is released
export function addTrapPlatforms(data){
    trapPlatforms = data
}

//this function tells the scene to restart, isReady tells the scene whether it should run
export function restartScene(isReady){
    ready = isReady
    restart = true
}

export default Game2