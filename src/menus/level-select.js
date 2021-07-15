//importing Phaser library
import Phaser from "phaser"
//importing functions from other scripts
import { createNewButton, createNewText } from "./components/components"
import { checkButtonPress } from "./components/frame-events"

//functions to communicate with puppet scene
import { restartScene } from "../game2"

//function to load the number of levels complete from the save file
import { load } from "../saving/saving-system"

//Creating the Main Menu scene. The create function is called at the start of the scene and the update function is called every frame
class LevelSelect extends Phaser.Scene{
    constructor(){
        super("LevelSelect")
    }
    init(){
        //load the data from the save file
        let levelsComplete = load("levels-complete")
        //if the data exists then set the value of the save to a variable
        if(levelsComplete){
            this.levelsComplete = levelsComplete
        }
        //if their is no data then set the variable value to 0
        else{
            this.levelsComplete = 0
        }
    }
    preload(){
        //loading all the sprites for use in the scene
        this.load.spritesheet("ui-button", "ui-button/ui-button.png", {frameWidth: 190, frameHeight: 49})
        this.load.spritesheet("ui-button-green", "ui-button/ui-button-green.png", {frameWidth: 49, frameHeight: 49})
    }
    create(){

        this.gameScale = this.scale.canvas.width/800

        //Create the text for the title
        this.texts = this.add.group()
        this.titleText = createNewText(this, this.texts, {x:400,y:100}, this.gameScale, {text:"Level Selection", font: "75px Future", fill: "#552eff"})

        //creating the button physics groups
        this.levelButtons = this.add.group()
        this.blankButtons = this.add.group()

        //creating the buttons to select the levels
        let i = 0
        for(i; i < this.levelsComplete+1; i++){
            let button = createNewButton(this, this.levelButtons, {x:80+i*160,y:300,w:50,h:50}, this.gameScale, {text:(i+1).toString(), font: "40px Future", fill: "#0000ff"}, 0x00ff00, loadLevel, {game:this, levelToStart:i+1}, "ui-button-green")
            button.level = i + 1
        }

        //creating the black buttons for spaces where there would be levels that the user hasn't unlocked
        for(i; i < 5; i++){
            createNewButton(this, this.levelButtons, {x:80+i*160,y:300,w:50,h:50}, this.gameScale, {text:"", font: "40px Future", fill: "#0000ff"}, 0x555555, null)
        }

        //creating a back button to return to the main menu
        this.uiButtons = this.add.group()
        this.backButton = createNewButton(this, this.uiButtons, {x:600,y:500,w:150,h:50}, this.gameScale, {text:"Back", font: "40px Future", fill: "#00ff00"}, 0xff0000, returnToMenu, this, "ui-button")

        //restart the puppet scene and tell it not to run
        restartScene(false)
    }
    update(){
        //check if any level buttons have been pressed
        checkButtonPress(this, this.levelButtons)
        //check if any ui buttons have been pressed (the back button)
        checkButtonPress(this, this.uiButtons)
    }
}

function loadLevel(obj){
    //load the level corresponding to the button pressed
    obj.game.scene.start("Level"+obj.levelToStart.toString())
}

function returnToMenu(game){
    //load the main menu
    game.scene.start("MainMenu")
}

export default LevelSelect