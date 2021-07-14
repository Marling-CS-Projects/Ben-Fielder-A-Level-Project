//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform, createNewButton, createNewLever, createNewSpikeSet, createNewExitDoor, createNewGameText} from "./components/components"
import {handleUserInput, checkInteractionKeyPress, checkPause} from "./components/controls"
import {checkButtonAnim, checkPlayersAtExit, moveExitDoor, moveMovingPlatforms, resetButtonValues, resetPlayerAtExit} from "./components/frame-events"
import {handleButtonPress, handleExitDoorCollision, handleLeverPress, handleSpikeCollision, setSafePlayerPosition} from "./components/collision-events"

//importing functions from game 2 in order to communicate with it
import {setBoxData, setButtonData, setCameraBounds, setEnemyData, setExitDoorData, setLeverData, setMovingPlatformData, setPlatformData, setPlayerData, setSpikeData, updateLeverRotation, updateExitDoorPosition, updateMovingPlatformPositions, updatePlayerPositions, restartScene, setGameTextData, updateButtonAnimation, setBackgroundData } from "../game2"

//The function to call when the level is completed
import { levelComplete } from "../saving/saving-system"

//The function to tell the pause menu which level is currently running
import { setCurrentScene } from "../menus/pause-menu"

//The level 1 scene. the create function is called at the start of the scene and the update function is called every frame
class Level1 extends Phaser.Scene{
    constructor(){
        super("Level1")
    }
    preload(){
        //loading all the sprites for use in the level
        this.load.image("player", "player/stand.png")
        this.load.image("player1r", "player/walk1r.png")
        this.load.image("player2r", "player/walk2r.png")
        
        this.load.image("buttonup", "button/buttonup.png")
        this.load.image("buttondown", "button/buttondown.png")

        this.load.spritesheet("lever", "lever/lever.png", {frameWidth:128, frameHeight:100})

        this.load.image("spike", "spike/spike.png")

        this.load.image("door", "door/door.png")

        this.load.image("grass", "ground/grass.png")
        this.load.image("grass-wall", "ground/grass-wall.png")

        this.load.image("movingPlatform", "moving-platform/moving-platform.png")

        this.load.image("background-grass", "background/grass.png")
    }
    create(){

        this.gameScale = this.scale.canvas.width/800
        
        for(let i = 0; i < Math.ceil(1500/1024); i++){
            this.add.sprite((512+i*1024)*this.gameScale, 300*this.gameScale, "background-grass").setDisplaySize(1024*this.gameScale, 1024*this.gameScale).setDepth(-2)
        }
        setBackgroundData("background-grass")

        //creating the players physics group and a player
        this.players = this.physics.add.group()
        this.player1 = createNewPlayer(this, this.players, 50, 525, this.gameScale, "player")
        this.player2 = createNewPlayer(this, this.players, 150, 525, this.gameScale, "player")
        //this.players.setDepth(1)

        //send player data to puppet scene
        setPlayerData([{x:50,y:525},{x:150,y:525}])

        //the platforms physics group
        this.platforms = this.physics.add.staticGroup()

        this.walls = this.physics.add.staticGroup()

        //setting the platform data
        let platformData = [{x:800,y:575,w:1600,h:50},{x:-5,y:400,w:10,h:1000},{x:1505,y:400,w:10,h:1000},
            {x:800,y:350,w:200,h:50},{x:1300,y:150,w:200,h:50}]

        //Creating the platforms and attaching them to the platforms physics group
        createNewPlatforms(this, this.platforms, platformData, this.gameScale, "grass", "grass-wall", this.walls)

        //send the platform data to scene 2
        setPlatformData({platforms:platformData, sprite:"grass"})

        //setting collider between the platforms and players which also sets a safe player position
        this.physics.add.collider(this.players, this.platforms, setSafePlayerPosition)

        //setting the buttons physics group and creating a button
        this.buttons = this.physics.add.staticGroup()
        this.button1 = createNewButton(this, this.buttons, {x:250,y:550,w:25,h:10}, this.gameScale, "buttonup")
        this.button2 = createNewButton(this, this.buttons, {x:825,y:325,w:25,h:10}, this.gameScale, "buttonup")

        //setting the colliders that trigger an event when a button is pressed
        this.physics.add.overlap(this.players, this.buttons, handleButtonPress)

        //send button data to other scene
        setButtonData([{x:250,y:550,w:25,h:10},{x:825,y:325,w:25,h:10}])

        //creating levers physics group and a lever
        this.levers = this.physics.add.staticGroup()
        this.lever = createNewLever(this, this.levers, {x:750,y:325,w:50,h:10}, this.gameScale, "lever")

        //setting collsion event between players and levers
        this.physics.add.overlap(this.players, this.levers, handleLeverPress)

        //send the lever data to second scene
        setLeverData([{x:750,y:325,w:50,h:10}])

        //moving platforms physics group and 2 moving platforms
        this.movingPlatforms = this.physics.add.group()
        this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:400,y:575,w:150,h:50}, {x:400,y:350}, {x:0,y:-1}, this.button1, this.gameScale, "movingPlatform")
        this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:600,y:350,w:150,h:50}, {x:600,y:500}, {x:0,y:1}, this.button2, this.gameScale, "movingPlatform")
        this.movingPlatform3 = createNewMovingPlatform(this, this.movingPlatforms, {x:1000,y:350,w:150,h:50}, {x:1050,y:150}, {x:0.25,y:-1}, this.lever, this.gameScale, "movingPlatform")

        //setting colliders
        this.physics.add.collider(this.players, this.movingPlatforms)

        //send moving platform data
        setMovingPlatformData([{x:400,y:500,w:150,h:50}, {x:600,y:350,w:150,h:50}, {x:1000,y:350,w:150,h:50}])

        //creating the spikes physics group and 2 spike sets
        this.spikes = this.physics.add.staticGroup()
        createNewSpikeSet(this, this.spikes, {x:750,y:550}, 35, this.gameScale, "spike")

        //setting the colliders for colliders for spikes
        this.physics.add.collider(this.players, this.spikes, handleSpikeCollision)

        setSpikeData([{x:750,y:550,count:35}])

        //creating the exit doors physics group and an exit door
        this.exitDoors = this.physics.add.group()
        this.exitDoor = createNewExitDoor(this, this.exitDoors, {x:1300,y:150}, this.platforms.children.entries[this.platforms.children.entries.length-1], this.gameScale, "door")
        this.exitDoors.setDepth(-1)

        //creating an overlap event bewtween the players and the door
        this.physics.add.overlap(this.players, this.exitDoors, handleExitDoorCollision)

        //send exit door data to other scene
        setExitDoorData([{x:1300,y:150}])

        //creating the game text for the level
        this.texts = this.add.group()
        createNewGameText(this, this.texts, {x:250,y:400}, "Move onto the button", 2, this.gameScale)
        createNewGameText(this, this.texts, {x:800,y:100}, "Press the ineraction key when on the lever", 3, this.gameScale)
        createNewGameText(this, this.texts, {x:1250,y:300}, "Don't jump on the spikes", 1, this.gameScale)
        createNewGameText(this, this.texts, {x:1200,y:75}, "Get to the exit door", 2, this.gameScale)

        //sending the game text data to game 2
        setGameTextData([{x:250,y:400,text:"Move onto the button",lines:2},{x:800,y:100,text:"Press the ineraction key when on the lever",lines:3},
            {x:1250,y:300,text:"Don't jump on the spikes",lines:1},{x:1200,y:75,text:"Get to the exit door",lines:2}])

        //making a side-scrolling camera to follow the player
        createFollowCamera(this, this.player2, {x1:0,y1:0,x2:1500,y2:600}, this.gameScale)

        //send the camera bounds to second scene
        setCameraBounds({x1:0,y1:0,x2:1500,y2:600})

        //making the varibles to listen to key presses
        createNewKeys(this)

        //components not used in the scene need to be set to null in game2
        setBoxData(null)
        setEnemyData(null)

        //restart the puppet scene and tell it to run
        restartScene(true)
    }
    update(){
        //functions to be called every frame to run the game
        handleUserInput(this, this.gameScale)
        moveMovingPlatforms(this)
        checkInteractionKeyPress(this)
        moveExitDoor(this, this.gameScale)
        checkButtonAnim(this)
        this.levelComplete = checkPlayersAtExit(this)

        //checks whether to pause the game
        checkPause(this, 1, setCurrentScene)

        //reset certain values on some game objects
        resetButtonValues(this)
        resetPlayerAtExit(this)

        //checks if the level has been completed
        if(this.levelComplete){
            levelComplete(1)
            this.scene.start("LevelSelect")
        }

        //functions to send data to puppet scene
        updatePlayerPositions(this.players.children.entries)
        updateMovingPlatformPositions(this.movingPlatforms.children.entries)
        updateButtonAnimation(this.buttons.children.entries)
        updateLeverRotation(this.levers.children.entries)
        updateExitDoorPosition(this.exitDoors.children.entries)
    }
}

export default Level1