//importing Phaser library
import Phaser from "phaser"
import { restartScene } from "../game2"
import { load } from "../saving/saving-system"

//Creating the Main Menu scene. The create function is called at the start of the scene and the update function is called every frame
class LevelSelect extends Phaser.Scene{
    constructor(){
        super("LevelSelect")
    }
    init(){
        let levelsComplete = load("levels-complete")
        if(levelsComplete){
            this.levelsComplete = levelsComplete
        }
        else{
            this.levelsComplete = 0
        }
    }
    create(){
        //Create the text for the title
        this.titleText = this.add.text(400, 100, "Level Selection", {font: "75px Arial", fill: "#552eff"}).setOrigin(0.5, 0.5)

        this.levelButtons = this.add.group()
        this.blankButtons = this.add.group()

        let i = 0
        for(i; i < this.levelsComplete+1; i++){
            let button = this.add.rectangle(80 + i*160, 300, 50, 50, 0x00ff00)
            button.level = i + 1
            this.add.text(80 + i*160, 300, button.level.toString(), {font: "50px Arial", fill: "#0000ff"}).setOrigin(0.5, 0.5)
            this.levelButtons.add(button)
        }

        for(i; i < 5; i++){
            let button = this.add.rectangle(80 + i*160, 300, 50, 50, 0x555555)
            this.blankButtons.add(button)
        }

        //restart the puppet scene and tell it not to run
        restartScene(false)
    }
    update(){
        //checking if the mouse is in place over the button when it is pressed and then call the onButtonClick function
        this.levelButtons.children.entries.forEach((button)=>{
            if((this.input.mousePointer.x > button.x-25 && this.input.mousePointer.x < button.x+25) && (this.input.mousePointer.y > button.y-25 && this.input.mousePointer.y < button.y+25) && this.input.mousePointer.isDown){
                loadLevel(this, button.level)
            }
        })
    }
}

function loadLevel(game, levelToStart){
    game.scene.start("Level"+levelToStart.toString())
}

export default LevelSelect