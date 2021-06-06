//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import { createNewButton, createNewText } from "./components/components"
import { checkButtonPress } from "./components/frame-events"

//functions to communicate with puppet scene
import { restartScene } from "../game2"

//Creating the Main Menu scene. The create function is called at the start of the scene and the update function is called every frame
class ControlsMenu extends Phaser.Scene{
    constructor(){
        super("ControlsMenu")
    }
    create(){
        //Create the text for the title
        this.texts = this.add.group()
        this.titleText = createNewText(this, this.texts, {x:400,y:100}, {text:"Controls", font: "50px Arial", fill: "#552eff"})

        //creating text to display the controls for the game
        this.player1Text1 = createNewText(this, this.texts, {x:400,y:200}, {text:"Player 1 controls: move left - left arrow, move right - right arrow,", font: "25px Arial", fill: "#ffffff"})
        this.player1Text2 = createNewText(this, this.texts, {x:400,y:225}, {text:"jump - up arrow, interact - backslash", font: "25px Arial", fill: "#ffffff"})
        this.player2Text1 = createNewText(this, this.texts, {x:400,y:300}, {text:"Player 2 controls: move left - A, move right - D,", font: "25px Arial", fill: "#ffffff"})
        this.player2Text2 = createNewText(this, this.texts, {x:400,y:325}, {text:"jump - W, interact - E", font: "25px Arial", fill: "#ffffff"})
        this.UniversalText = createNewText(this, this.texts, {x:400,y:400}, {text:"Universal controls: pause - P", font: "25px Arial", fill: "#ffffff"})

        //creating a back button to return to the main menu
        this.uiButtons = this.add.group()
        this.backButton = createNewButton(this, this.uiButtons, {x:600,y:500,w:150,h:50}, {text:"Back", font: "50px Arial", fill: "#00ff00"}, 0xff0000, returnToMenu, this)

        //restart the puppet scene and tell it not to run
        restartScene(false)
    }
    update(){
        //check if any ui buttons have been pressed (the back button)
        checkButtonPress(this, this.uiButtons)
    }
}

function returnToMenu(game){
    //load the main menu
    game.scene.start("MainMenu")
}

export default ControlsMenu