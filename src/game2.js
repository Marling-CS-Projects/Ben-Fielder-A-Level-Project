//importing libraries
import React from "react"
import Phaser from "phaser"
import {IonPhaser} from "@ion-phaser/react"

//import functions from other scripts
import {createNewPlatforms, createFollowCamera, createNewBox, createNewButton, createNewLever, createNewMovingPlatform, createNewSpikeSet, createNewEnemy, createNewExitDoor, createNewGameText, createNewPlayer} from "./levels/components/components"

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
            parent: 'game2',
            width: (window.innerWidth/2-50),
            height: ((window.innerWidth/2-50)*(600/800)),
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 * ((window.innerWidth/2-50)/800) },
                    debug: false
                }
            },
            scene: {
                preload: preload,
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
let playerData, platformData, boxData, buttonData, leverData, movingPlatformData, spikeData, enemyData, exitDoorData, cameraBounds, gameTextData, backgroundData

//variable for getting data on how to update each element
let playerUpdateData, movingPlatformPositions, boxPositions, leverUpdateData, enemyPositions, exitDoorPositions, buttonUpdateData

//variable to store data about traps
let trapPlatforms

//variables to tell the scene when to run
let restart
let ready

function preload(){
    //loading all the sprites for use in the level
    this.load.image("p1", "player/stand.png")
    this.load.image("p1run1", "player/walk1r.png")
    this.load.image("p1run2", "player/walk2r.png")
    this.load.image("p2", "player/p2-stand.png")
    this.load.image("p2run1", "player/p2-walk1.png")
    this.load.image("p2run2", "player/p2-walk2.png")
    
    this.load.image("buttonup", "button/buttonup.png")
    this.load.image("buttondown", "button/buttondown.png")

    this.load.spritesheet("lever", "lever/lever.png", {frameWidth:128, frameHeight:100})

    this.load.image("box", "box/box.png")

    this.load.image("spike", "spike/spike.png")

    this.load.image("door", "door/door.png")

    this.load.image("enemy1", "enemy/enemy1.png")
    this.load.image("enemy2", "enemy/enemy2.png")

    this.load.image("grass", "ground/grass.png")
    this.load.image("sand", "ground/sand.png")
    this.load.image("snow", "ground/snow.png")
    this.load.image("dirt", "ground/dirt.png")
    this.load.image("planet", "ground/planet.png")
    this.load.image("grass-wall", "ground/grass-wall.png")
    this.load.image("sand-wall", "ground/sand-wall.png")
    this.load.image("snow-wall", "ground/snow-wall.png")
    this.load.image("dirt-wall", "ground/dirt-wall.png")
    this.load.image("planet-wall", "ground/planet-wall.png")

    this.load.image("movingPlatform", "moving-platform/moving-platform.png")

    this.load.image("background-grass", "background/grass.png")
    this.load.image("background-desert", "background/desert.png")
    this.load.image("background-ice", "background/ice.png")
    this.load.image("background-cave", "background/cave.png")
    this.load.image("background-shroom", "background/shroom.png")
}

//create function called at the start of the game
function create(){
    restart = false
    if(!ready){return}

    this.gameScale = this.scale.canvas.width/800

    if(backgroundData){
        if(backgroundData === "background-cave"){
            this.add.sprite(400*this.gameScale, 1100*this.gameScale, "background-cave").setDisplaySize(2200*this.gameScale, 2200*this.gameScale).setDepth(-2)
        }
        else{
            for(let i = 0; i < Math.ceil(cameraBounds.x2/1024); i++){
                let background = this.add.sprite((512+i*1024)*this.gameScale, (cameraBounds.y2/2)*this.gameScale, backgroundData).setDepth(-2)
                background.setDisplaySize(background.width*this.gameScale, background.height*this.gameScale)
            }
        }
    }

    //create the players based on data received from game 1
    this.players = this.add.group()
    this.player1 = createNewPlayer(this, this.players, playerData[0].x, playerData[0].y, this.gameScale, "p1")
    this.player2 = createNewPlayer(this, this.players, playerData[1].x, playerData[1].y, this.gameScale, "p2")

    //create the platforms based on data from game 1
    if(platformData){
        this.platforms = this.add.group()
        createNewPlatforms(this, this.platforms, platformData.platforms, this.gameScale, platformData.sprite, platformData.sprite+"-wall")
    }

    //create the boxes from the data received from game 1
    if(boxData){
        this.boxes = this.add.group()
        boxData.forEach((box)=>{
            createNewBox(this, this.boxes, {x:box.x,y:box.y,w:33,h:33}, this.gameScale, "box")
        })
    }

    //create the buttons
    if(buttonData){
        this.buttons = this.add.group()
        buttonData.forEach((button)=>{
            createNewButton(this, this.buttons, {x:button.x,y:button.y,w:button.w,h:button.h}, this.gameScale, "buttonup")
        })
    }

    //create the levers
    if(leverData){
        this.levers = this.add.group()
        leverData.forEach((lever)=>{
            createNewLever(this, this.levers, {x:lever.x,y:lever.y,w:lever.w,h:lever.h}, this.gameScale, "lever")
        })
    }

    //create the spikes
    if(spikeData){
        this.spikes = this.add.group()
        spikeData.forEach((spike)=>{
            createNewSpikeSet(this, this.spikes, {x:spike.x,y:spike.y}, spike.count, this.gameScale, "spike")
        })
    }

    //create the enemies
    if(enemyData){
        this.enemies = this.add.group()
        enemyData.forEach((enemy)=>{
            createNewEnemy(this, this.enemies, {x:enemy.x,y:enemy.y}, null, null, this.gameScale, "enemy1")
        })
    }

    //create the moving platforms
    if(movingPlatformData){
        this.movingPlatforms = this.physics.add.staticGroup()
        movingPlatformData.forEach((movingPlatform)=>{
            createNewMovingPlatform(this, this.movingPlatforms, {x:movingPlatform.x,y:movingPlatform.y,w:movingPlatform.w,h:movingPlatform.h}, null, null, null, this.gameScale, "movingPlatform")
        })
    }

    //create the exit doors
    if(exitDoorData){
        this.exitDoors = this.physics.add.staticGroup()
        exitDoorData.forEach((exitDoor)=>{
            createNewExitDoor(this, this.exitDoors, {x:exitDoor.x,y:exitDoor.y}, exitDoor.floor, this.gameScale, "door")
        })
        this.exitDoors.setDepth(-1)
    }

    //creating the game text
    if(gameTextData){
        this.texts = this.add.group()
        gameTextData.forEach((gameText)=>{
            createNewGameText(this, this.texts, {x:gameText.x,y:gameText.y}, gameText.text, gameText.lines, this.gameScale)
        })
    }

    //create the side-scrolling camera
    createFollowCamera(this, this.player1, cameraBounds, this.gameScale)
}

//update function is called every frame
function update(){
    if(restart){
        this.scene.restart()
        return
    }
    if(!ready){return}

    //update the players' positions
    if(playerUpdateData){
        for(let i = 0; i < playerUpdateData.length; i++){
            this.players.children.entries[i].setPosition(playerUpdateData[i].x, playerUpdateData[i].y)
            if(playerUpdateData[i].animation){
                this.players.children.entries[i].anims.play(playerUpdateData[i].animation, true)
                this.players.children.entries[i].flipX = playerUpdateData[i].flipX
            }
        }
    }
    //update moving platform positions
    if(movingPlatformPositions){
        for(let i = 0; i < movingPlatformPositions.length; i++){
            this.movingPlatforms.children.entries[i].setPosition(movingPlatformPositions[i].x, movingPlatformPositions[i].y)
        }
    }
    //update box positions
    if(boxPositions){
        for(let i = 0; i < boxPositions.length; i++){
            this.boxes.children.entries[i].setPosition(boxPositions[i].x, boxPositions[i].y)
        }
    }
    //update the animation of the buttons
    if(buttonUpdateData){
        for(let i = 0; i < buttonUpdateData.length; i++){
            if(buttonUpdateData[i].animation){
                this.buttons.children.entries[i].anims.play(buttonUpdateData[i].animation, true)
            }
        }
    }
    //update the rotation on the levers
    if(leverUpdateData){
        for(let i = 0; i < leverUpdateData.length; i++){
            this.levers.children.entries[i].setRotation(leverUpdateData[i].rotation)
            if(leverUpdateData[i].animation){
                this.levers.children.entries[i].anims.play(leverUpdateData[i].animation, true)
            }
        }
    }
    //update the position of the enemies
    if(enemyPositions){
        for(let i = 0; i < enemyPositions.length; i++){
            this.enemies.children.entries[i].setPosition(enemyPositions[i].x, enemyPositions[i].y)
            this.enemies.children.entries[i].flipX = enemyPositions[i].flipX
        }
    }
    //update posititions for exit doors
    if(exitDoorPositions){
        for(let i = 0; i < exitDoorPositions.length; i++){
            this.exitDoors.children.entries[i].setPosition(exitDoorPositions[i].x, exitDoorPositions[i].y)
        }
    }
    if(trapPlatforms){
        createNewPlatforms(this, this.platforms, trapPlatforms.platforms, this.gameScale, trapPlatforms.sprite, trapPlatforms.sprite+"-wall")
        trapPlatforms = null
    }
}

export function setBackgroundData(backgroundInfo){
    backgroundData = backgroundInfo
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

//receiving the game text data
export function setGameTextData(gameTextInfo){
    gameTextData = gameTextInfo
}

//receiving the camera data
export function setCameraBounds(bounds){
    cameraBounds = bounds
}

//receiving the positions of the players
export function updatePlayerPositions(data){
    playerUpdateData = data
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
export function updateButtonAnimation(data){
    buttonUpdateData = data
}

//receiving the rotations of the levers
export function updateLeverRotation(data){
    leverUpdateData = data
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