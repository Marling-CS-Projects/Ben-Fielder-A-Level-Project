//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform, createNewBox, createNewButton, createNewLever, createNewSpikeSet, createNewEnemy, createNewExitDoor} from "../components/components"
import {handleUserInput, checkInteractionKeyPress} from "../components/controls"
import {checkEnemyDistanceToPlayer, checkPlayersAtExit, moveEnemies, moveExitDoor, moveMovingPlatforms, resetBoxVelocity, resetButtonValues, resetPlayerAtExit} from "../components/frame-events"
import {handleButtonPress, handleEnemyCollision, handleExitDoorCollision, handleLeverPress, handleSpikeCollision, setSafePlayerPosition} from "../components/collision-events"

//importing functions from game 2 in order to communicate with it
import {setBoxData, setButtonData, setCameraBounds, setEnemyData, setExitDoorData, setLeverData, setMovingPlatformData, setPlatformData, setPlayerData, setSpikeData, upadateLeverRotation, updateBoxPosition, updateEnemyPosition, updateExitDoorPosition, updateMovingPlatformPositions, updatePlayerPositions, restartScene } from "../game2"
import { levelComplete } from "../saving/saving-system"


//The level 1 scene. the create function is called at the start of the scene and the update function is called every frame
class Level1 extends Phaser.Scene{
    constructor(){
        super("Level1")
    }
    create(){
        //creating the players physics group and a player
        this.players = this.physics.add.group()
        this.player1 = createNewPlayer(this, this.players, 400, 525)
        this.player2 = createNewPlayer(this, this.players, 400, 525)

        //send player data to puppet scene
        setPlayerData([{x:400,y:525},{x:400,y:525}])

        //the platforms physics group
        this.platforms = this.physics.add.staticGroup()

        //setting the platform data
        let platformData = [{x:800,y:575,w:1600,h:50},{x:-5,y:300,w:10,h:700},{x:1605,y:300,w:10,h:700},
            {x:400,y:310,w:300,h:50},{x:150,y:160,w:150,h:50},{x:650,y:200,w:100,h:50},
            {x:850,y:425,w:250,h:50},{x:1150,y:375,w:175,h:50},{x:1500,y:200,w:200,h:50}];

        //Creating the platforms and attaching them to the platforms physics group
        createNewPlatforms(this, this.platforms, platformData)

        //send the platform data to scene 2
        setPlatformData(platformData)

        //setting collider between the platforms and players which also sets a safe player position
        this.physics.add.collider(this.players, this.platforms, setSafePlayerPosition)

        //creating boxes physics group and 2 boxes
        this.boxes = this.physics.add.group()
        this.box1 = createNewBox(this, this.boxes, {x:550,y:525,w:33,h:33})
        this.box2 = createNewBox(this, this.boxes, {x:600,y:160,w:33,h:33})

        //Setting colliders for boxes
        this.physics.add.collider(this.players, this.boxes)
        this.physics.add.collider(this.platforms, this.boxes)
        this.physics.add.collider(this.boxes, this.boxes)
        
        //send box data to other scene
        setBoxData([{x:550,y:525,w:33,h:33}, {x:600,y:160,w:33,h:33}])

        //setting the buttons physics group and creating a button
        this.buttons = this.physics.add.staticGroup()
        this.button = createNewButton(this, this.buttons, {x:650,y:175,w:25,h:10})

        //setting the colliders that trigger an event when a button is pressed
        this.physics.add.collider(this.players, this.buttons, handleButtonPress)
        this.physics.add.overlap(this.boxes, this.buttons, handleButtonPress)

        //send button data to other scene
        setButtonData([{x:650,y:175,w:25,h:10}])

        //creating levers physics group and a lever
        this.levers = this.physics.add.staticGroup()
        this.lever = createNewLever(this, this.levers, {x:250,y:550,w:50,h:10})

        //setting collsion event between players and levers
        this.physics.add.overlap(this.players, this.levers, handleLeverPress)

        //send the lever data to second scene
        setLeverData([{x:250,y:550,w:50,h:10}])

        //moving platforms physics group and 2 moving platforms
        this.movingPlatforms = this.physics.add.group()
        this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:900,y:175,w:200,h:50}, {x:1250,y:175}, {x:1,y:0}, this.button)
        this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:100,y:525,w:200,h:50}, {x:100,y:325}, {x:0,y:-1}, this.lever)

        //setting colliders
        this.physics.add.collider(this.players, this.movingPlatforms)
        this.physics.add.collider(this.movingPlatforms, this.boxes)

        //send moving platform data
        setMovingPlatformData([{x:900,y:175,w:200,h:50}, {x:100,y:525,w:200,h:50}])

        //creating the spikes physics group and 2 spike sets
        this.spikes = this.physics.add.staticGroup()
        createNewSpikeSet(this, this.spikes, {x:300,y:550}, 3)
        createNewSpikeSet(this, this.spikes, {x:1000,y:550}, 25)

        //setting the colliders for colliders for spikes
        this.physics.add.collider(this.players, this.spikes, handleSpikeCollision)
        this.physics.add.collider(this.boxes, this.spikes)

        //send spike data
        setSpikeData([{x:300,y:550,count:3}, {x:1000,y:550,count:25}])

        //create the eniemies physics group and 2 enemies
        this.enemies = this.physics.add.group()
        this.enemy1 = createNewEnemy(this, this.enemies, {x:300,y:260}, 500, 50)
        this.enemy2 = createNewEnemy(this, this.enemies, {x:600,y:525}, 900, 50)

        //set colliders for enemies including an event for between players and enemies
        this.physics.add.collider(this.enemies, this.platforms)
        this.physics.add.overlap(this.players, this.enemies, handleEnemyCollision)

        //send enemy data
        setEnemyData([{x:300,y:260}, {x:600,y:525}])

        //creating the exit doors physics group and an exit door
        this.exitDoors = this.physics.add.group()
        this.exitDoor = createNewExitDoor(this, this.exitDoors, {x:1500,y:200}, this.platforms.children.entries[this.platforms.children.entries.length-1])

        //creating an overlap event bewtween the players and the door
        this.physics.add.overlap(this.players, this.exitDoors, handleExitDoorCollision)

        //send exit door data to other scene
        setExitDoorData([{x:1500,y:200}])

        //making a side-scrolling camera to follow the player
        createFollowCamera(this, this.player2, {x1:0,y1:0,x2:1600,y2:600})

        //send the camera bounds to second scene
        setCameraBounds({x1:0,y1:0,x2:1600,y2:600})

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
        moveEnemies(this)
        checkEnemyDistanceToPlayer(this)
        moveExitDoor(this)
        this.levelComplete = checkPlayersAtExit(this, "Level2", 1)
        resetButtonValues(this)
        resetBoxVelocity(this)
        resetPlayerAtExit(this)

        if(this.levelComplete){
            levelComplete(1)
            this.scene.start("Level2")
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

export default Level1