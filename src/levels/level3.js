//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform, createNewButton, createNewLever, createNewSpikeSet, createNewEnemy, createNewExitDoor, createNewTrap} from "./components/components"
import {handleUserInput, checkInteractionKeyPress, checkPause} from "./components/controls"
import {checkEnemyDistanceToPlayer, checkPlayersAtExit, checkTrap, moveEnemies, moveExitDoor, moveMovingPlatforms, resetButtonValues, resetPlayerAtExit} from "./components/frame-events"
import {handleButtonPress, handleEnemyCollision, handleExitDoorCollision, handleLeverPress, handleSpikeCollision, setSafePlayerPosition} from "./components/collision-events"

//importing functions from game 2 in order to communicate with it
import {setBoxData, setButtonData, setCameraBounds, setEnemyData, setExitDoorData, setLeverData, setMovingPlatformData, setPlatformData, setPlayerData, setSpikeData, upadateLeverRotation, updateEnemyPosition, updateExitDoorPosition, updateMovingPlatformPositions, updatePlayerPositions, restartScene, addTrapPlatforms } from "../game2"

//The function to call when the level is completed
import { levelComplete } from "../saving/saving-system"

//The function to tell the pause menu which level is currently running
import { setLevelNumber } from "../menus/pause-menu"

//The level 1 scene. the create function is called at the start of the scene and the update function is called every frame
class Level3 extends Phaser.Scene{
    constructor(){
        super("Level3")
    }
    create(){
        //creating the players physics group and a player
        this.players = this.physics.add.group()
        this.player1 = createNewPlayer(this, this.players, 50, 625)
        this.player2 = createNewPlayer(this, this.players, 1750, 625)

        //send player data to puppet scene
        setPlayerData([{x:50,y:625},{x:1750,y:625}])

        //the platforms physics group
        this.platforms = this.physics.add.staticGroup()

        //setting the platform data
        let platformData = [{x:900,y:675,w:1800,h:50},{x:-5,y:400,w:10,h:900},{x:1805,y:400,w:10,h:900},
            {x:625,y:450,w:150,h:50},{x:750,y:450,w:50,h:500},{x:1150,y:450,w:300,h:50},{x:675,y:200,w:200,h:50}];

        //Creating the platforms and attaching them to the platforms physics group
        createNewPlatforms(this, this.platforms, platformData)

        //send the platform data to scene 2
        setPlatformData(platformData)

        //setting collider between the platforms and players which also sets a safe player position
        this.physics.add.collider(this.players, this.platforms, setSafePlayerPosition)

        //setting the buttons physics group and creating a button
        this.buttons = this.physics.add.staticGroup()
        this.button1 = createNewButton(this, this.buttons, {x:200,y:650,w:25,h:10})
        this.button2 = createNewButton(this, this.buttons, {x:1012,y:425,w:25,h:10})
        this.button3 = createNewButton(this, this.buttons, {x:750,y:175,w:25,h:10})

        //setting the colliders that trigger an event when a button is pressed
        this.physics.add.overlap(this.players, this.buttons, handleButtonPress)

        //send button data to other scene
        setButtonData([{x:200,y:650,w:25,h:10},{x:1012,y:425,w:25,h:10},{x:750,y:175,w:25,h:10}])

        //creating levers physics group and a lever
        this.levers = this.physics.add.staticGroup()
        this.lever1 = createNewLever(this, this.levers, {x:1650,y:650,w:50,h:10})
        this.lever2 = createNewLever(this, this.levers, {x:625,y:425,w:50,h:10})

        //setting collsion event between players and levers
        this.physics.add.overlap(this.players, this.levers, handleLeverPress)

        //send the lever data to second scene
        setLeverData([{x:1450,y:650,w:50,h:10},{x:625,y:425,w:50,h:10}])

        //moving platforms physics group and 2 moving platforms
        this.movingPlatforms = this.physics.add.group()
        this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:400,y:625,w:200,h:50}, {x:400,y:500}, {x:0,y:-1}, this.lever1)
        this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:400,y:250,w:200,h:50}, {x:400,y:400}, {x:0,y:1}, this.button3)
        this.movingPlatform3 = createNewMovingPlatform(this, this.movingPlatforms, {x:1450,y:625,w:200,h:50}, {x:1350,y:500}, {x:0,y:-1}, this.lever2)
        this.movingPlatform4 = createNewMovingPlatform(this, this.movingPlatforms, {x:875,y:400,w:150,h:50}, {x:875,y:200}, {x:0,y:-1}, this.button2)

        //setting colliders
        this.physics.add.collider(this.players, this.movingPlatforms)
        this.physics.add.collider(this.movingPlatforms, this.boxes)

        //send moving platform data
        setMovingPlatformData([{x:400,y:625,w:200,h:50},{x:400,y:400,w:200,h:50},{x:1350,y:625,w:200,h:50},{x:875,y:400,w:150,h:50}])

        //creating the spikes physics group and 2 spike sets
        this.spikes = this.physics.add.staticGroup()
        createNewSpikeSet(this, this.spikes, {x:800,y:650}, 16)

        //setting the colliders for colliders for spikes
        this.physics.add.collider(this.players, this.spikes, handleSpikeCollision)

        //send spike data
        setSpikeData([{x:800,y:650,count:16}])

        //create the eniemies physics group and 2 enemies
        this.enemies = this.physics.add.group()
        this.enemy1 = createNewEnemy(this, this.enemies, {x:1100,y:360}, 1275, 50)

        //set colliders for enemies including an event for between players and enemies
        this.physics.add.collider(this.enemies, this.platforms)
        this.physics.add.overlap(this.players, this.enemies, handleEnemyCollision)
        this.physics.add.overlap(this.enemies, this.buttons, handleButtonPress)

        //send enemy data
        setEnemyData([{x:1100,y:360}])

        //creating the exit doors physics group and an exit door
        this.exitDoors = this.physics.add.group()
        this.exitDoor = createNewExitDoor(this, this.exitDoors, {x:575,y:200}, this.platforms.children.entries[this.platforms.children.entries.length-1])

        //creating an overlap event bewtween the players and the door
        this.physics.add.overlap(this.players, this.exitDoors, handleExitDoorCollision)

        //send exit door data to other scene
        setExitDoorData([{x:575,y:200}])

        //creating a trap
        this.trap = createNewTrap(this, this.platforms, this.button1, [{x:140,y:550,w:50,h:200},{x:260,y:550,w:50,h:200}])

        //making a side-scrolling camera to follow the player
        createFollowCamera(this, this.player2, {x1:0,y1:0,x2:1800,y2:700})

        //send the camera bounds to second scene
        setCameraBounds({x1:0,y1:0,x2:1800,y2:700})

        //making the varibles to listen to key presses
        createNewKeys(this)
        
        //components not used in the scene need to be set to null in game2
        setBoxData(null)

        //restart the puppet scene and tell it to run
        restartScene(true)
    }
    update(){
        //functions to be called every frame to run the game
        handleUserInput(this)
        moveMovingPlatforms(this)
        checkInteractionKeyPress(this)
        moveEnemies(this)
        checkEnemyDistanceToPlayer(this)
        moveExitDoor(this)
        checkTrap(this, this.trap, createNewPlatforms, addTrapPlatforms)
        this.levelComplete = checkPlayersAtExit(this)

        //checks whether to pause the game
        checkPause(this, 3, setLevelNumber)

        //reset certain values on some game objects
        resetButtonValues(this)
        resetPlayerAtExit(this)

        //checks if the level has been completed
        if(this.levelComplete){
            levelComplete(3)
            this.scene.start("LevelSelect")
        }

        //functions to send data to puppet scene
        updatePlayerPositions(this.players.children.entries)
        updateMovingPlatformPositions(this.movingPlatforms.children.entries)
        upadateLeverRotation(this.levers.children.entries)
        updateEnemyPosition(this.enemies.children.entries)
        updateExitDoorPosition(this.exitDoors.children.entries)
    }
}

export default Level3