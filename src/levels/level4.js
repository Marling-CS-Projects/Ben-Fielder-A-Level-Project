//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform, createNewBox, createNewButton, createNewLever, createNewSpikeSet, createNewEnemy, createNewExitDoor} from "./components/components"
import {handleUserInput, checkInteractionKeyPress, checkPause} from "./components/controls"
import {checkEnemyDistanceToPlayer, checkPlayersAtExit, moveEnemies, moveExitDoor, moveMovingPlatforms, resetBoxVelocity, resetButtonValues, resetPlayerAtExit} from "./components/frame-events"
import {handleButtonPress, handleEnemyCollision, handleExitDoorCollision, handleLeverPress, handleSpikeCollision, setSafePlayerPosition} from "./components/collision-events"

//importing functions from game 2 in order to communicate with it
import {setBoxData, setButtonData, setCameraBounds, setEnemyData, setExitDoorData, setLeverData, setMovingPlatformData, setPlatformData, setPlayerData, setSpikeData, upadateLeverRotation, updateBoxPosition, updateEnemyPosition, updateExitDoorPosition, updateMovingPlatformPositions, updatePlayerPositions, restartScene } from "../game2"

//The function to call when the level is completed
import { levelComplete } from "../saving/saving-system"

//The function to tell the pause menu which level is currently running
import { setLevelNumber } from "../menus/pause-menu"

//The level 1 scene. the create function is called at the start of the scene and the update function is called every frame
class Level4 extends Phaser.Scene{
    constructor(){
        super("Level4")
    }
    create(){
        //creating the players physics group and a player
        this.players = this.physics.add.group()
        this.player1 = createNewPlayer(this, this.players, 50, 2125)
        this.player2 = createNewPlayer(this, this.players, 750, 225)

        //send player data to puppet scene
        setPlayerData([{x:50,y:2125},{x:750,y:225}])

        //the platforms physics group
        this.platforms = this.physics.add.staticGroup()

        //setting the platform data
        let platformData = [{x:-5,y:1100,w:10,h:2500},{x:805,y:1100,w:10,h:2500},{x:400,y:2175,w:800,h:50},
            {x:300,y:1875,w:600,h:50},{x:500,y:1575,w:600,h:50},{x:500,y:275,w:600,h:50},{x:300,y:575,w:600,h:50},
            {x:500,y:875,w:600,h:50},{x:500,y:1275,w:300,h:50},{x:100,y:1275,w:200,h:50},{x:100,y:1075,w:200,h:50},{x:200,y:1175,w:50,h:250}];

        //Creating the platforms and attaching them to the platforms physics group
        createNewPlatforms(this, this.platforms, platformData)

        //send the platform data to scene 2
        setPlatformData(platformData)

        //setting collider between the platforms and players which also sets a safe player position
        this.physics.add.collider(this.players, this.platforms, setSafePlayerPosition)

        //creating boxes physics group and 2 boxes
        this.boxes = this.physics.add.group()
        this.box1 = createNewBox(this, this.boxes, {x:150,y:2125,w:33,h:33})
        this.box2 = createNewBox(this, this.boxes, {x:650,y:225,w:33,h:33})

        //Setting colliders for boxes
        this.physics.add.collider(this.players, this.boxes)
        this.physics.add.collider(this.platforms, this.boxes)
        this.physics.add.collider(this.boxes, this.boxes)
        
        //send box data to other scene
        setBoxData([{x:150,y:2125,w:33,h:33}, {x:650,y:225,w:33,h:33}])

        //setting the buttons physics group and creating a button
        this.buttons = this.physics.add.staticGroup()
        this.button1 = createNewButton(this, this.buttons, {x:550,y:1850,w:25,h:10})
        this.button2 = createNewButton(this, this.buttons, {x:550,y:550,w:25,h:10})
        this.button3 = createNewButton(this, this.buttons, {x:100,y:1050,w:25,h:10})

        //setting the colliders that trigger an event when a button is pressed
        //in this level, I only want boxes to activate buttons.
        this.physics.add.overlap(this.boxes, this.buttons, handleButtonPress)

        //send button data to other scene
        setButtonData([{x:550,y:1850,w:25,h:10},{x:550,y:550,w:25,h:10},{x:100,y:1050,w:25,h:10}])

        //creating levers physics group and a lever
        this.levers = this.physics.add.staticGroup()
        this.lever1 = createNewLever(this, this.levers, {x:550,y:2150,w:50,h:10})
        this.lever2 = createNewLever(this, this.levers, {x:600,y:1550,w:50,h:10})
        this.lever3 = createNewLever(this, this.levers, {x:250,y:850,w:50,h:10})
        this.lever4 = createNewLever(this, this.levers, {x:600,y:1250,w:50,h:10})

        //setting collsion event between players and levers
        this.physics.add.overlap(this.players, this.levers, handleLeverPress)

        //send the lever data to second scene
        setLeverData([{x:550,y:2150,w:50,h:10},{x:600,y:1550,w:50,h:10},{x:250,y:850,w:50,h:10},{x:600,y:1250,w:50,h:10}])

        //moving platforms physics group and 2 moving platforms
        this.movingPlatforms = this.physics.add.group()
        this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:700,y:2175,w:200,h:50}, {x:700,y:1875}, {x:0,y:-1}, this.lever1)
        this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:100,y:1825,w:200,h:50}, {x:100,y:1575}, {x:0,y:-1}, this.button2)
        this.movingPlatform3 = createNewMovingPlatform(this, this.movingPlatforms, {x:725,y:1525,w:150,h:50}, {x:725,y:1275}, {x:0,y:-1}, this.lever3)
        this.movingPlatform4 = createNewMovingPlatform(this, this.movingPlatforms, {x:100,y:275,w:200,h:50}, {x:100,y:525}, {x:0,y:1}, this.button1)
        this.movingPlatform5 = createNewMovingPlatform(this, this.movingPlatforms, {x:700,y:575,w:200,h:50}, {x:700,y:875}, {x:0,y:1}, this.lever2)
        this.movingPlatform6 = createNewMovingPlatform(this, this.movingPlatforms, {x:100,y:875,w:200,h:50}, {x:300,y:875}, {x:1,y:0}, this.lever4)
        this.movingPlatform7 = createNewMovingPlatform(this, this.movingPlatforms, {x:100,y:1225,w:200,h:50}, {x:300,y:1225}, {x:1,y:0}, this.button3)

        //setting colliders
        this.physics.add.collider(this.players, this.movingPlatforms)
        this.physics.add.collider(this.movingPlatforms, this.boxes)

        //send moving platform data
        setMovingPlatformData([{x:700,y:2175,w:200,h:50}, {x:100,y:1825,w:200,h:50},{x:725,y:1525,w:150,h:50},{x:100,y:275,w:200,h:50},{x:700,y:575,w:200,h:50},{x:100,y:875,w:200,h:50},{x:100,y:1225,w:200,h:50}])

        //creating the spikes physics group and 2 spike sets
        this.spikes = this.physics.add.staticGroup()
        createNewSpikeSet(this, this.spikes, {x:300,y:1850}, 6)

        //setting the colliders for colliders for spikes
        this.physics.add.collider(this.players, this.spikes, handleSpikeCollision)
        this.physics.add.collider(this.boxes, this.spikes)

        //send spike data
        setSpikeData([{x:300,y:1850,count:6}])

        //create the eniemies physics group and 2 enemies
        this.enemies = this.physics.add.group()
        this.enemy1 = createNewEnemy(this, this.enemies, {x:300,y:2125}, 450, 50)
        this.enemy2 = createNewEnemy(this, this.enemies, {x:300,y:1525}, 550, 50)
        this.enemy3 = createNewEnemy(this, this.enemies, {x:400,y:1225}, 550, 50)
        this.enemy4 = createNewEnemy(this, this.enemies, {x:250,y:225}, 500, 50)
        this.enemy5 = createNewEnemy(this, this.enemies, {x:250,y:525}, 450, 50)
        this.enemy6 = createNewEnemy(this, this.enemies, {x:400,y:825}, 550, 50)

        //set colliders for enemies including an event for between players and enemies
        this.physics.add.collider(this.enemies, this.platforms)
        this.physics.add.overlap(this.players, this.enemies, handleEnemyCollision)

        //send enemy data
        setEnemyData([{x:300,y:2125},{x:300,y:1525},{x:400,y:1225},{x:250,y:225},{x:250,y:525},{x:400,y:825}])

        //creating the exit doors physics group and an exit door
        this.exitDoors = this.physics.add.group()
        this.exitDoor = createNewExitDoor(this, this.exitDoors, {x:100,y:1175}, this.movingPlatform7)

        //creating an overlap event bewtween the players and the door
        this.physics.add.overlap(this.players, this.exitDoors, handleExitDoorCollision)

        //send exit door data to other scene
        setExitDoorData([{x:100,y:1175}])

        //making a side-scrolling camera to follow the player
        createFollowCamera(this, this.player2, {x1:0,y1:0,x2:800,y2:2200})

        //send the camera bounds to second scene
        setCameraBounds({x1:0,y1:0,x2:800,y2:2200})

        //making the varibles to listen to key presses
        createNewKeys(this)

        //restart the puppet scene and tell it to run
        restartScene(true)
    }
    update(){
        //functions to be called every frame to run the game
        handleUserInput(this)
        moveMovingPlatforms(this)
        checkInteractionKeyPress(this)
        checkEnemyDistanceToPlayer(this)
        moveEnemies(this)
        moveExitDoor(this)
        this.levelComplete = checkPlayersAtExit(this)

        //checks whether to pause the game
        checkPause(this, 4, setLevelNumber)

        //reset certain values on some game objects
        resetButtonValues(this)
        resetBoxVelocity(this)
        resetPlayerAtExit(this)

        //checks if the level has been completed
        if(this.levelComplete){
            levelComplete(4)
            this.scene.start("LevelSelect")
        }

        //functions to send data to puppet scene
        updatePlayerPositions(this.players.children.entries)
        updateMovingPlatformPositions(this.movingPlatforms.children.entries)
        updateBoxPosition(this.boxes.children.entries)
        upadateLeverRotation(this.levers.children.entries)
        updateEnemyPosition(this.enemies.children.entries)
        updateExitDoorPosition(this.exitDoors.children.entries)
    }
}

export default Level4