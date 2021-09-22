//importing Phaser library
import Phaser from "phaser"

//importing functions from other scripts
import { createNewButton, createNewText } from "./components/components"
import { checkButtonPress } from "./components/frame-events"

//functions to communicate with puppet scene
import { restartScene } from "../game2"

//Creating the Credits Menu scene. The create function is called at the start of the scene and the update function is called every frame
class CreditsMenu extends Phaser.Scene{
    constructor(){
        super("CreditsMenu")
    }
    preload(){
        //loading all the sprites for use in the scene
        this.load.spritesheet("ui-button", "ui-button/ui-button.png", {frameWidth: 190, frameHeight: 49})

        this.load.image("background", "background/grass.png")
    }
    create(){

        this.gameScale = this.scale.canvas.width/800

        this.add.sprite(512*this.gameScale, 300*this.gameScale, "background").setDisplaySize(1024*this.gameScale, 1024*this.gameScale).setDepth(-2)

        //Create the text for the title
        this.texts = this.add.group()
        this.titleText = createNewText(this, this.texts, {x:400,y:100}, this.gameScale, {text:"Credits", font: "50px Future", fill: "#552eff"})

        //creating text to display the controls for the game
        this.credit1text = createNewText(this, this.texts, {x:400,y:200}, this.gameScale, {text:"Created and Devloped by Ben Fielder", font: "32px Future", fill: "#000000"})
        this.credit2text = createNewText(this, this.texts, {x:400,y:300}, this.gameScale, {text:"Kenny - Background for levels 1, 2, 3 and 5, platforms,", font: "18px Future", fill: "#000000"})
        this.credit2text2 = createNewText(this, this.texts, {x:400,y:320}, this.gameScale, {text:"ineractable objects, enemies and font", font: "18px Future", fill: "#000000"})
        this.credit3text = createNewText(this, this.texts, {x:400,y:350}, this.gameScale, {text:"PWL - Background for level 4", font: "18px Future", fill: "#000000"})
        this.credit4text = createNewText(this, this.texts, {x:400,y:400}, this.gameScale, {text:"Ahmed Khalf - football and football goal", font: "18px Future", fill: "#000000"})
        this.credit5text = createNewText(this, this.texts, {x:400,y:450}, this.gameScale, {text:"CodeManu - Music", font: "18px Future", fill: "#000000"})

        //creating a back button to return to the main menu
        this.uiButtons = this.add.group()
        this.backButton = createNewButton(this, this.uiButtons, {x:600,y:500,w:150,h:50}, this.gameScale, {text:"Back", font: "40px Future", fill: "#00ff00"}, 0xff0000, returnToMenu, this, "ui-button")

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

export default CreditsMenu