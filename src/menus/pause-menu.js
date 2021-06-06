//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import { createNewButton, createNewText } from "./components/components"
import { checkButtonPress } from "./components/frame-events"

//variable to store the value of the current level
let currentLevelNumber

//Creating the PauseMenu scene. The create function is called at the start of the scene and the update function is called every frame
class PauseMenu extends Phaser.Scene{
    constructor(){
        super("PauseMenu")
    }
    create(){
        //This brings the pause menu to the top of the display
        this.scene.bringToTop("PauseMenu")

        //creating the title text
        this.texts = this.add.group()
        this.titleText = createNewText(this, this.texts, {x:400,y:100}, {text: "Game Paused", font: "75px Arial", fill: "#552eff"})

        //creating the buttons. One will resume the level when pressed, the other will return the player to the main menu
        this.buttons = this.add.group()
        this.resumeButton = createNewButton(this, this.buttons, {x:400,y:300,w:250,h:50}, {text: "Resume", font: "50px Arial", fill: "#000000"}, 0xffffff, resume, this)
        this.menuButton = createNewButton(this, this.buttons, {x:400,y:450,w:250,h:50}, {text: "Go to Menu", font: "44px Arial", fill: "#000000"}, 0xffffff, goToMenu, this)
    }
    update(){
        //checks for button presses in the buttons group
        checkButtonPress(this, this.buttons)
    }
}

//funtion to resume the game. Stops the puase menu and resumes the current level
function resume(game){
    game.scene.stop("PauseMenu")
    game.scene.resume("Level"+currentLevelNumber.toString())
}

//function to go to the main menu. Stops the current level and starts the main menu scene
function goToMenu(game){
    game.scene.stop("Level"+currentLevelNumber.toString())
    game.scene.start("MainMenu")
}

//called in a level scene to set the current level
export function setLevelNumber(levelNumber){
    currentLevelNumber = levelNumber
}

export default PauseMenu