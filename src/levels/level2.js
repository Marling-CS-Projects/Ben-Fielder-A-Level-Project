//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform, createNewBox, createNewButton, createNewSpikeSet, createNewEnemy, createNewExitDoor, createNewGameText} from "./components/components"
import {handleUserInput, checkInteractionKeyPress, checkPause} from "./components/controls"
import {checkButtonAnim, checkEnemyDistanceToPlayer, checkPlayersAtExit, moveEnemies, moveExitDoor, moveMovingPlatforms, resetBoxVelocity, resetButtonValues, resetPlayerAtExit} from "./components/frame-events"
import {handleButtonPress, handleEnemyCollision, handleExitDoorCollision, handleSpikeCollision, setSafePlayerPosition} from "./components/collision-events"

//importing functions from game 2 in order to communicate with it
import {setBoxData, setButtonData, setCameraBounds, setEnemyData, setExitDoorData, setLeverData, setMovingPlatformData, setPlatformData, setPlayerData, setSpikeData, updateBoxPosition, updateEnemyPosition, updateExitDoorPosition, updateMovingPlatformPositions, updatePlayerPositions, restartScene, setGameTextData, updateButtonAnimation, setBackgroundData } from "../game2"

//The function to call when the level is completed
import { levelComplete } from "../saving/saving-system"

//The function to tell the pause menu which level is currently running
import { setCurrentScene } from "../menus/pause-menu"

//The level 2 scene. the create function is called at the start of the scene and the update function is called every frame
class Level2 extends Phaser.Scene{
    constructor(){
        super("Level2")
    }
    preload(){
        //loading all the sprites for use in the level
        this.load.image("player", "player/stand.png")
        this.load.image("player1r", "player/walk1r.png")
        this.load.image("player2r", "player/walk2r.png")
        
        this.load.image("buttonup", "button/buttonup.png")
        this.load.image("buttondown", "button/buttondown.png")

        this.load.image("box", "box/box.png")

        this.load.image("spike", "spike/spike.png")

        this.load.image("door", "door/door.png")

        this.load.image("enemy1", "enemy/enemy1.png")
        this.load.image("enemy2", "enemy/enemy2.png")

        this.load.image("sand", "ground/sand.png")
        this.load.image("sand-wall", "ground/sand-wall.png")
        
        this.load.image("movingPlatform", "moving-platform/moving-platform.png")

        this.load.image("background-desert", "background/desert.png")
    }
    create(){

        this.gameScale = this.scale.canvas.width/800

        for(let i = 0; i < Math.ceil(1800/1024); i++){
            this.add.sprite((512+i*1024)*this.gameScale, 300*this.gameScale, "background-desert").setDisplaySize(1024*this.gameScale, 1024*this.gameScale).setDepth(-2)
        }
        setBackgroundData("background-desert")

        //creating the players physics group and a player
        this.players = this.physics.add.group()
        this.player1 = createNewPlayer(this, this.players, 50, 525, this.gameScale, "player")
        this.player2 = createNewPlayer(this, this.players, 1750, 525, this.gameScale, "player")
        this.players.setDepth(1)

        //send player data to puppet scene
        setPlayerData([{x:50,y:525},{x:1750,y:525}])

        //the platforms physics group
        this.platforms = this.physics.add.staticGroup()

        this.walls = this.physics.add.staticGroup()

        //setting the platform data
        let platformData = [{x:900,y:575,w:1800,h:50},{x:-5,y:400,w:10,h:1000},{x:1805,y:400,w:10,h:1000},
            {x:650,y:375,w:200,h:50},{x:1150,y:375,w:200,h:50},{x:900,y:250,w:200,h:50}]

        //Creating the platforms and attaching them to the platforms physics group
        createNewPlatforms(this, this.platforms, platformData, this.gameScale, "sand", "sand-wall", this.walls)

        //send the platform data to scene 2
        setPlatformData({platforms:platformData, sprite:"sand"})

        //setting collider between the platforms and players which also sets a safe player position
        this.physics.add.collider(this.players, this.platforms, setSafePlayerPosition)

        //creating boxes physics group and 2 boxes
        this.boxes = this.physics.add.group()
        this.box1 = createNewBox(this, this.boxes, {x:150,y:525,w:33,h:33}, this.gameScale, "box")
        this.box2 = createNewBox(this, this.boxes, {x:1650,y:525,w:33,h:33}, this.gameScale, "box")

        //Setting colliders for boxes
        this.physics.add.collider(this.players, this.boxes)
        this.physics.add.collider(this.platforms, this.boxes)
        this.physics.add.collider(this.boxes, this.boxes)
        
        //send box data to other scene
        setBoxData([{x:150,y:525,w:33,h:33}, {x:1650,y:525,w:33,h:33}])

        //setting the buttons physics group and creating a button
        this.buttons = this.physics.add.staticGroup()
        this.button1 = createNewButton(this, this.buttons, {x:225,y:550,w:25,h:10}, this.gameScale, "buttonup")
        this.button2 = createNewButton(this, this.buttons, {x:1575,y:550,w:25,h:10}, this.gameScale, "buttonup")

        //setting the colliders that trigger an event when a button is pressed
        this.physics.add.overlap(this.players, this.buttons, handleButtonPress)
        this.physics.add.overlap(this.boxes, this.buttons, handleButtonPress)

        //send button data to other scene
        setButtonData([{x:225,y:550,w:25,h:10},{x:1375,y:550,w:25,h:10}])

        //moving platforms physics group and 2 moving platforms
        this.movingPlatforms = this.physics.add.group()
        this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:400,y:525,w:200,h:50}, {x:400,y:375}, {x:0,y:-1}, this.button1, this.gameScale, "movingPlatform")
        this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:1400,y:525,w:200,h:50}, {x:1200,y:375}, {x:0,y:-1}, this.button2, this.gameScale, "movingPlatform")

        //setting colliders
        this.physics.add.collider(this.players, this.movingPlatforms)
        this.physics.add.collider(this.movingPlatforms, this.boxes)

        //send moving platform data
        setMovingPlatformData([{x:400,y:525,w:200,h:50}, {x:1200,y:525,w:200,h:50}])

        //creating the spikes physics group and 2 spike sets
        this.spikes = this.physics.add.staticGroup()
        createNewSpikeSet(this, this.spikes, {x:600,y:550}, 25, this.gameScale, "spike")

        //setting the colliders for colliders for spikes
        this.physics.add.collider(this.players, this.spikes, handleSpikeCollision)
        this.physics.add.collider(this.boxes, this.spikes)

        //send spike data
        setSpikeData([{x:600,y:550,count:16}])

        //create the eniemies physics group and 2 enemies
        this.enemies = this.physics.add.group()
        this.enemy1 = createNewEnemy(this, this.enemies, {x:575,y:325}, 725, 50, this.gameScale, "enemy1")
        this.enemy2 = createNewEnemy(this, this.enemies, {x:1075,y:325}, 1225, 50, this.gameScale, "enemy1")

        //set colliders for enemies including an event for between players and enemies
        this.physics.add.collider(this.enemies, this.platforms)
        this.physics.add.overlap(this.players, this.enemies, handleEnemyCollision)
        this.physics.add.collider(this.enemies, this.walls)

        //send enemy data
        setEnemyData([{x:575,y:325}, {x:1075,y:325}])

        //creating the exit doors physics group and an exit door
        this.exitDoors = this.physics.add.group()
        this.exitDoor = createNewExitDoor(this, this.exitDoors, {x:900,y:200}, this.platforms.children.entries[this.platforms.children.entries.length-1], this.gameScale, "door")
        this.exitDoors.setDepth(-1)

        //creating an overlap event bewtween the players and the door
        this.physics.add.overlap(this.players, this.exitDoors, handleExitDoorCollision)

        //send exit door data to other scene
        setExitDoorData([{x:900,y:200}])

        //creating the game text for the level
        this.texts = this.add.group()
        createNewGameText(this, this.texts, {x:150,y:350}, "Push the box onto the button", 2, this.gameScale)
        createNewGameText(this, this.texts, {x:1650,y:350}, "Push the box onto the button", 2, this.gameScale)
        createNewGameText(this, this.texts, {x:600,y:200}, "Mind the enemy", 2, this.gameScale)
        createNewGameText(this, this.texts, {x:1200,y:200}, "Mind the enemy", 2, this.gameScale)

        //sending the game text data to game 2
        setGameTextData([{x:150,y:350,text:"Push the box onto the button",lines:2},{x:1650,y:350,text:"Push the box onto the button",lines:2},
            {x:600,y:200,text:"Mind the enemy",lines:2},{x:1200,y:200,text:"Mind the enemy",lines:2}])

        //making a side-scrolling camera to follow the player
        createFollowCamera(this, this.player2, {x1:0,y1:0,x2:1800,y2:600}, this.gameScale)

        //send the camera bounds to second scene
        setCameraBounds({x1:0,y1:0,x2:1800,y2:600})

        //making the varibles to listen to key presses
        createNewKeys(this)

        //components not used in the scene need to be set to null in game2
        setLeverData(null)

        //restart the puppet scene and tell it to run
        restartScene(true)
    }
    update(){
        //functions to be called every frame to run the game
        handleUserInput(this, this.gameScale)
        moveMovingPlatforms(this)
        checkInteractionKeyPress(this)
        moveEnemies(this)
        checkEnemyDistanceToPlayer(this, this.gameScale)
        moveExitDoor(this, this.gameScale)
        checkButtonAnim(this)
        this.levelComplete = checkPlayersAtExit(this)

        //checks whether to pause the game
        checkPause(this, 2, setCurrentScene)

        //reset certain values on some game objects
        resetButtonValues(this)
        resetBoxVelocity(this)
        resetPlayerAtExit(this)

        //checks if the level has been completed
        if(this.levelComplete){
            levelComplete(2)
            this.scene.start("LevelSelect")
        }

        //functions to send data to puppet scene
        updatePlayerPositions(this.players.children.entries)
        updateMovingPlatformPositions(this.movingPlatforms.children.entries)
        updateBoxPosition(this.boxes.children.entries)
        updateButtonAnimation(this.buttons.children.entries)
        updateEnemyPosition(this.enemies.children.entries)
        updateExitDoorPosition(this.exitDoors.children.entries)
    }
}

export default Level2