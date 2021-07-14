//importing libraries
import React from "react"
import Phaser from "phaser"
import {IonPhaser} from "@ion-phaser/react"

//importing the Menu scenes
import MainMenu from "./menus/main-menu"
import LevelSelect from "./menus/level-select"
import MinigameMenu from "./menus/minigame-menu"
import ControlsMenu from "./menus/controls-menu"
import PauseMenu from "./menus/pause-menu"

//importing the level scenes
import Level1 from "./levels/level1"
import Level2 from "./levels/level2"
import Level3 from "./levels/level3"
import Level4 from "./levels/level4"
import Level5 from "./levels/level5"

//importing the minigames
import StarCollector from "./minigames/star-collector"
import Football from "./minigames/football"

/***  This is the controlling game. Each scene sends
****  information over to game2 when it is started
****  and then restarts game2 which gives the impression
*///  that game2 has changed scenes as well.

//Class to initialise the Phaser game
class Game1 extends React.Component{
    //Phaser configuration
    state = {
        initialize: true,
        game: {
            type: Phaser.AUTO,
            parent: 'game1',
            width: (window.innerWidth/2-50),
            height: ((window.innerWidth/2-50)*(600/800)),
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 * ((window.innerWidth/2-50)/800) },
                    debug: false
                }
            },
            //This is where to add the scenes to the game.
            //MainMenu is the first scene called as it is the first listed
            scene: [
                MainMenu,
                LevelSelect,
                MinigameMenu,
                ControlsMenu,
                PauseMenu,
                Level1,
                Level2,
                Level3,
                Level4,
                Level5,
                StarCollector,
                Football
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

export default Game1