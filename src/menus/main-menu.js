//importing Phaser library
import Phaser from "phaser"
import { restartScene } from "../game2"

//Creating the Main Menu scene. The create function is called at the start of the scene and the update function is called every frame
class MainMenu extends Phaser.Scene{
    constructor(){
        super("MainMenu")
    }
    create(){
        //Create the text for the title
        this.titleText = this.add.text(400, 150, "Menu", {font: "75px Arial", fill: "#552eff"}).setOrigin(0.5, 0.5)

        //creating a button by making a box and some text
        this.buttonBox = this.add.rectangle(400, 300, 150, 50, 0xff0000)
        this.buttonText = this.add.text(400, 300, "start", {font: "50px Arial", fill: "#00ff00"}).setOrigin(0.5, 0.5)

        //restart the puppet scene and tell it not to run
        restartScene(false)
    }
    update(){
        //checking if the mouse is in place over the button when it is pressed and then call the onButtonClick function
        if((this.input.mousePointer.x > 325 && this.input.mousePointer.x < 475) && (this.input.mousePointer.y > 275 && this.input.mousePointer.y < 325) && this.input.mousePointer.isDown){
            onButtonClick(this)
        }
    }
}

function onButtonClick(game){
    //load the scene Level1
    game.scene.start("LevelSelect")
}

export default MainMenu