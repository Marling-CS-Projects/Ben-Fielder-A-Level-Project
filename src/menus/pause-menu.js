//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import { createNewButton, createNewText } from "./components/components"
import { checkButtonPress } from "./components/frame-events"

//variable to store the value of the current scene
let currentScene

//Creating the PauseMenu scene. The create function is called at the start of the scene and the update function is called every frame
class PauseMenu extends Phaser.Scene{
    constructor(){
        super("PauseMenu")
    }
    preload(){
        //loading all the sprites for use in the scene
        this.load.spritesheet("ui-button-white", "ui-button/ui-button-white.png", {frameWidth:190,frameHeight:49})
    }
    create(){

        this.gameScale = this.scale.canvas.width/800

        //This brings the pause menu to the top of the display
        this.scene.bringToTop("PauseMenu")

        //creating the title text
        this.texts = this.add.group()
        this.titleText = createNewText(this, this.texts, {x:400,y:100}, this.gameScale, {text: "Game Paused", font: "75px Future", fill: "#552eff"})

        //creating the buttons. One will resume the level when pressed, the other will return the player to the main menu
        this.buttons = this.add.group()
        this.resumeButton = createNewButton(this, this.buttons, {x:400,y:300,w:250,h:50}, this.gameScale, {text: "Resume", font: "40px Future", fill: "#000000"}, 0xffffff, resume, this, "ui-button-white")
        if(parseInt(currentScene[5])){
            this.restartButton = createNewButton(this, this.buttons, {x:400,y:400,w:250,h:50}, this.gameScale, {text: "Restart Level", font: "25px Future", fill: "#000000"}, 0xffffff, restartLevel, this, "ui-button-white")
        }
        this.menuButton = createNewButton(this, this.buttons, {x:400,y:500,w:250,h:50}, this.gameScale, {text: "Go to Menu", font: "35px Future", fill: "#000000"}, 0xffffff, goToMenu, this, "ui-button-white")
    }
    update(){
        //checks for button presses in the buttons group
        checkButtonPress(this, this.buttons)
    }
}

//funtion to resume the game. Stops the puase menu and resumes the current level
function resume(game){
    game.scene.stop("PauseMenu")
    game.scene.resume(currentScene)
}

//function to restart the current level
function restartLevel(game){
    game.sound.stopAll()
    game.scene.start(currentScene)
}

//function to go to the main menu. Stops the current level and reloads the page.
function goToMenu(game){
    game.sound.stopAll()
    game.scene.stop(currentScene)
    game.scene.stop("PauseMenu")
    // game.scene.start("PreloadScene")
    // eslint-disable-next-line no-restricted-globals
    location.reload()
}

//called in a scene to set the current scene
export function setCurrentScene(scene){
    currentScene = scene
}

export default PauseMenu