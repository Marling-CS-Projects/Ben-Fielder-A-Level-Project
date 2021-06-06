//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import { createNewButton, createNewText } from "./components/components"
import { checkButtonPress } from "./components/frame-events"

//functions to communicate with puppet scene
import { restartScene } from "../game2"

//function to restart game save file
import { restartGame } from "../saving/saving-system"


//Creating the Main Menu scene. The create function is called at the start of the scene and the update function is called every frame
class MainMenu extends Phaser.Scene{
    constructor(){
        super("MainMenu")
    }
    create(){
        //Create the text for the title
        this.texts = this.add.group()
        this.titleText = createNewText(this, this.texts, {x:400,y:100}, {text: "Menu", font: "75px Arial", fill: "#552eff"})

        //create the buttons for new game and load game
        this.buttons = this.add.group()
        this.newGameButton = createNewButton(this, this.buttons, {x:400, y:250, w:300, h:50}, {text:"New Game", font: "50px Arial", fill: "#00ff00"}, 0xff0000, restartSave, this)
        this.startButton = createNewButton(this, this.buttons, {x:400, y:350, w:300, h:50}, {text:"Load Game", font: "50px Arial", fill: "#00ff00"}, 0xff0000, continueGame, this)
        this.controlsButton = createNewButton(this, this.buttons, {x:400, y:450, w:300, h:50}, {text:"Controls", font: "50px Arial", fill: "#00ff00"}, 0xff0000, seeControls, this)

        //restart the puppet scene and tell it not to run
        restartScene(false)
    }
    update(){
        //checks for button presses in the buttons group
        checkButtonPress(this, this.buttons)
    }
}

function continueGame(game){
    //load the scene Level Select
    game.scene.start("LevelSelect")
}

function restartSave(game){
    //restarts the saved game
    restartGame()
    //load the scene Level Select
    game.scene.start("LevelSelect")
}

function seeControls(game){
    game.scene.start("ControlsMenu")
}

export default MainMenu