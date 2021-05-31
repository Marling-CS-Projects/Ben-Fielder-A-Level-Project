//importing libraries
import React from "react"
import Phaser from "phaser"
import {IonPhaser} from "@ion-phaser/react"

//importing the MainMenu scene
import MainMenu from "./menus/main-menu"

//importing the Level1 scene
import Level1 from "./levels/level1"

class Game extends React.Component{
    //Phaser configuration
    state = {
        initialize: true,
        game: {
            type: Phaser.AUTO,
            parent: 'phaser-example',
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            //This is where to add the scenes to the game.
            //MainMenu is the first scene called as it is the first listed
            scene: [
                MainMenu,
                Level1
            ]
        }
    }
    render(){
        const { initialize, game } = this.state
        return(
            //returning the Phaser game as a jsx component
            <IonPhaser game={game} initialize={initialize} />
        )
    }
}

export default Game