//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import {createNewPlatforms, createNewPlayer, createNewKeys, createFollowCamera, createNewMovingPlatform, createNewButton, createNewLever, createNewSpikeSet, createNewEnemy, createNewExitDoor, createNewTrap, createNewGameText} from "./components/components"
import {handleUserInput, checkInteractionKeyPress, checkPause} from "./components/controls"
import {checkButtonAnim, checkEnemyDistanceToPlayer, checkPlayersAtExit, checkTrap, moveEnemies, moveExitDoor, moveMovingPlatforms, resetButtonValues, resetPlayerAtExit} from "./components/frame-events"
import {handleButtonPress, handleEnemyCollision, handleExitDoorCollision, handleLeverPress, handleSpikeCollision, setSafePlayerPosition} from "./components/collision-events"

//importing functions from game 2 in order to communicate with it
import {setBoxData, setButtonData, setCameraBounds, setEnemyData, setExitDoorData, setLeverData, setMovingPlatformData, setPlatformData, setPlayerData, setSpikeData, updateLeverRotation, updateEnemyPosition, updateExitDoorPosition, updateMovingPlatformPositions, updatePlayerPositions, restartScene, addTrapPlatforms, setGameTextData, updateButtonAnimation, setBackgroundData } from "../game2"

//The function to call when the level is completed
import { levelComplete } from "../saving/saving-system"

//The function to tell the pause menu which level is currently running
import { setCurrentScene } from "../menus/pause-menu"

//The level 3 scene. the create function is called at the start of the scene and the update function is called every frame
class Level3 extends Phaser.Scene{
    constructor(){
        super("Level3")
    }
    preload(){
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

        this.load.image("spike", "spike/spike.png")

        this.load.image("door", "door/door.png")

        this.load.image("enemy1", "enemy/enemy1.png")
        this.load.image("enemy2", "enemy/enemy2.png")

        this.load.image("snow", "ground/snow.png")
        this.load.image("snow-wall", "ground/snow-wall.png")

        this.load.image("movingPlatform", "moving-platform/moving-platform.png")

        this.load.image("background-ice", "background/ice.png")

        this.load.audio("iceland", "music/iceland.mp3")
    }
    create(){

        this.gameScale = this.scale.canvas.width/800

        this.music = this.sound.add("iceland")
        this.music.play({loop:true})

        for(let i = 0; i < Math.ceil(1800/1024); i++){
            this.add.sprite((512+i*1024)*this.gameScale, 350*this.gameScale, "background-ice").setDisplaySize(1024*this.gameScale, 1024*this.gameScale).setDepth(-2)
        }
        setBackgroundData("background-ice")

        //creating the players physics group and a player
        this.players = this.physics.add.group()
        this.player1 = createNewPlayer(this, this.players, 50, 625, this.gameScale, "p1")
        this.player2 = createNewPlayer(this, this.players, 1750, 625, this.gameScale, "p2")
        this.players.setDepth(1)

        //send player data to puppet scene
        setPlayerData([{x:50,y:625},{x:1750,y:625}])

        //the platforms physics group
        this.platforms = this.physics.add.staticGroup()

        this.walls = this.physics.add.staticGroup()

        //setting the platform data
        let platformData = [{x:900,y:675,w:1800,h:50},{x:-5,y:400,w:10,h:900},{x:1805,y:400,w:10,h:900},
            {x:625,y:450,w:150,h:50},{x:750,y:450,w:50,h:500},{x:1150,y:450,w:300,h:50},{x:675,y:200,w:200,h:50}]

        //Creating the platforms and attaching them to the platforms physics group
        createNewPlatforms(this, this.platforms, platformData, this.gameScale, "snow", "snow-wall", this.walls)

        //send the platform data to scene 2
        setPlatformData({platforms:platformData, sprite:"snow"})

        //setting collider between the platforms and players which also sets a safe player position
        this.physics.add.collider(this.players, this.platforms, setSafePlayerPosition)

        //setting the buttons physics group and creating a button
        this.buttons = this.physics.add.staticGroup()
        this.button1 = createNewButton(this, this.buttons, {x:200,y:650,w:25,h:10}, this.gameScale, "buttonup")
        this.button2 = createNewButton(this, this.buttons, {x:1012,y:425,w:25,h:10}, this.gameScale, "buttonup")
        this.button3 = createNewButton(this, this.buttons, {x:750,y:175,w:25,h:10}, this.gameScale, "buttonup")

        //setting the colliders that trigger an event when a button is pressed
        this.physics.add.overlap(this.players, this.buttons, handleButtonPress)

        //send button data to other scene
        setButtonData([{x:200,y:650,w:25,h:10},{x:1012,y:425,w:25,h:10},{x:750,y:175,w:25,h:10}])

        //creating levers physics group and a lever
        this.levers = this.physics.add.staticGroup()
        this.lever1 = createNewLever(this, this.levers, {x:1650,y:650,w:50,h:10}, this.gameScale, "lever")
        this.lever2 = createNewLever(this, this.levers, {x:625,y:425,w:50,h:10}, this.gameScale, "lever")

        //setting collsion event between players and levers
        this.physics.add.overlap(this.players, this.levers, handleLeverPress)

        //send the lever data to second scene
        setLeverData([{x:1450,y:650,w:50,h:10},{x:625,y:425,w:50,h:10}])

        //moving platforms physics group and 2 moving platforms
        this.movingPlatforms = this.physics.add.group()
        this.movingPlatform1 = createNewMovingPlatform(this, this.movingPlatforms, {x:400,y:625,w:200,h:50}, {x:400,y:500}, {x:0,y:-1}, this.lever1, this.gameScale, "movingPlatform")
        this.movingPlatform2 = createNewMovingPlatform(this, this.movingPlatforms, {x:400,y:250,w:200,h:50}, {x:400,y:400}, {x:0,y:1}, this.button3, this.gameScale, "movingPlatform")
        this.movingPlatform3 = createNewMovingPlatform(this, this.movingPlatforms, {x:1450,y:625,w:200,h:50}, {x:1350,y:500}, {x:0,y:-1}, this.lever2, this.gameScale, "movingPlatform")
        this.movingPlatform4 = createNewMovingPlatform(this, this.movingPlatforms, {x:875,y:400,w:150,h:50}, {x:875,y:200}, {x:0,y:-1}, this.button2, this.gameScale, "movingPlatform")

        //setting colliders
        this.physics.add.collider(this.players, this.movingPlatforms)
        this.physics.add.collider(this.movingPlatforms, this.boxes)

        //send moving platform data
        setMovingPlatformData([{x:400,y:625,w:200,h:50},{x:400,y:400,w:200,h:50},{x:1350,y:625,w:200,h:50},{x:875,y:400,w:150,h:50}])

        //creating the spikes physics group and 2 spike sets
        this.spikes = this.physics.add.staticGroup()
        createNewSpikeSet(this, this.spikes, {x:800,y:650}, 16, this.gameScale, "spike")

        //setting the colliders for colliders for spikes
        this.physics.add.collider(this.players, this.spikes, handleSpikeCollision)

        //send spike data
        setSpikeData([{x:800,y:650,count:16}])

        //create the eniemies physics group and 2 enemies
        this.enemies = this.physics.add.group()
        this.enemy1 = createNewEnemy(this, this.enemies, {x:1100,y:360}, 1275, 50, this.gameScale, "enemy1")

        //set colliders for enemies including an event for between players and enemies
        this.physics.add.collider(this.enemies, this.platforms)
        this.physics.add.overlap(this.players, this.enemies, handleEnemyCollision)
        this.physics.add.overlap(this.enemies, this.buttons, handleButtonPress)
        this.physics.add.collider(this.enemies, this.walls)

        //send enemy data
        setEnemyData([{x:1100,y:360}])

        //creating the exit doors physics group and an exit door
        this.exitDoors = this.physics.add.group()
        this.exitDoor = createNewExitDoor(this, this.exitDoors, {x:575,y:200}, this.platforms.children.entries[this.platforms.children.entries.length-1], this.gameScale, "door")
        this.exitDoors.setDepth(-1)

        //creating an overlap event bewtween the players and the door
        this.physics.add.overlap(this.players, this.exitDoors, handleExitDoorCollision)

        //send exit door data to other scene
        setExitDoorData([{x:575,y:200}])

        //creating a trap
        this.trap = createNewTrap(this, this.platforms, this.button1, [{x:140,y:550,w:50,h:200},{x:260,y:550,w:50,h:200}], "snow")

        //creating the game text for the level
        this.texts = this.add.group()
        createNewGameText(this, this.texts, {x:200,y:450}, "Don't jump on this button", 2, this.gameScale)
        createNewGameText(this, this.texts, {x:625,y:300}, "Sometimes levers move something for the other player", 4, this.gameScale)
        createNewGameText(this, this.texts, {x:1650,y:350}, "Sometimes levers move something for the other player", 4, this.gameScale)
        createNewGameText(this, this.texts, {x:1250,y:250}, "Lure the enemy onto the button", 2, this.gameScale)
        createNewGameText(this, this.texts, {x:1200,y:75}, "Beware of traps", 2, this.gameScale)
        createNewGameText(this, this.texts, {x:200,y:75}, "Beware of traps", 2, this.gameScale)
        createNewGameText(this, this.texts, {x:700,y:50}, "You are on your own now", 2, this.gameScale)

        //sending the game text data to game 2
        setGameTextData([{x:200,y:450,text:"Don't jump on this button",lines:2},{x:625,y:300,text:"Sometimes levers move something for the other player",lines:4},
            {x:1650,y:350,text:"Sometimes levers move something for the othe player",lines:4},{x:1200,y:75,text:"Beware of traps",lines:2},
            {x:200,y:75,text:"Beware of traps",lines:2},{x:700,y:50,text:"You are on your own now",lines:2}])

        //making a side-scrolling camera to follow the player
        createFollowCamera(this, this.player2, {x1:0,y1:0,x2:1800,y2:700}, this.gameScale)

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
        handleUserInput(this, this.gameScale)
        moveMovingPlatforms(this)
        checkInteractionKeyPress(this)
        moveEnemies(this)
        checkEnemyDistanceToPlayer(this, this.gameScale)
        moveExitDoor(this, this.gameScale)
        checkTrap(this, this.trap, createNewPlatforms, addTrapPlatforms)
        checkButtonAnim(this)
        this.levelComplete = checkPlayersAtExit(this)

        //checks whether to pause the game
        checkPause(this, 3, setCurrentScene)

        //reset certain values on some game objects
        resetButtonValues(this)
        resetPlayerAtExit(this)

        //checks if the level has been completed
        if(this.levelComplete){
            levelComplete(3)
            this.music.stop()
            this.scene.start("LevelSelect", {needToPlayMusic:true})
        }

        //functions to send data to puppet scene
        updatePlayerPositions(this.players.children.entries)
        updateMovingPlatformPositions(this.movingPlatforms.children.entries)
        updateButtonAnimation(this.buttons.children.entries)
        updateLeverRotation(this.levers.children.entries)
        updateEnemyPosition(this.enemies.children.entries)
        updateExitDoorPosition(this.exitDoors.children.entries)
    }
}

export default Level3