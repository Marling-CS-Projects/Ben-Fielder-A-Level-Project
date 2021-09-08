/* eslint-disable no-undef */
//importing Phaser library
import Phaser from "phaser"

//import functions for use in the scene
import { createHighScoreText, createNewPlatforms, createNewPlayer } from "./components/components";
import { checkPause, checkTextText, moveText } from "./components/frame-events";

//importing function from game 2 in order to restart it
import {restartScene} from "../game2"

//function to help pause the scene
import { setCurrentScene } from "../menus/pause-menu";


//The StarCollector minigame scene. the create function is called at the start of the scene and the update function is called every frame
class StarCollector extends Phaser.Scene{
    constructor(){
        super("StarCollector")
    }
    preload(){
        //loading all the sprites for use in the level
        this.load.image("player", "player/stand.png")
        this.load.image("player1r", "player/walk1r.png")
        this.load.image("player2r", "player/walk2r.png")

        this.load.image("grass", "ground/grass.png")
        this.load.image("grass-wall", "ground/grass-wall.png")

        this.load.image("star", "star-collector/star.png")

        this.load.image("background", "background/grass.png")

        this.load.audio("intro", "music/intro.mp3")
    }
    create(){
        //this is needed when writing code within socket events as "this" won't refer to the game
        let game = this

        this.gameScale = this.scale.canvas.width/800

        //play the music
        this.music = this.sound.add("intro")
        this.music.play({loop:true})

        for(let i = 0; i < Math.ceil(1600/1024); i++){
            this.add.sprite((512+i*1024)*this.gameScale, 300*this.gameScale, "background").setDisplaySize(1024*this.gameScale, 1024*this.gameScale)
        }
        
        //this is the socket.io reference
        this.socket = io()

        //creating the players group
        this.players = this.add.group()

        //creating the platforms group and platforms
        this.platforms = this.add.group()
        let platformData = [{x:800,y:575,w:1600,h:50},{x:-5,y:400,w:10,h:1000},{x:1605,y:400,w:10,h:1000},
            {x:100,y:450,w:200,h:50},{x:675,y:450,w:150,h:50},{x:1150,y:450,w:200,h:50},{x:1375,y:400,w:150,h:50},
            {x:350,y:325,w:200,h:50},{x:175,y:175,w:100,h:50},{x:650,y:175,w:300,h:50},{x:950,y:100,w:50,h:50},
            {x:900,y:375,w:200,h:50},{x:1150,y:225,w:200,h:50},{x:1450,y:175,w:300,h:50}]
        createNewPlatforms(this, this.platforms, platformData, this.gameScale, "grass")

        //the list of current scores
        this.currentScores = []
  
        //setting the camera bounds
        this.cameras.main.setBounds(0, 0, 1600*this.gameScale, 600*this.gameScale)

        //creating the ui text
        this.nameText = this.add.text(16*this.gameScale, 16*this.gameScale, "", { fontSize: "32px Future", fill: '#0000ff' })
        this.highscoreTexts = this.add.group()
        createHighScoreText(this, this.highscoreTexts, {x:500,y:16}, 5, this.gameScale)

        //creating the key listeners
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.pauseButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)

        //restart game 2 and tell it not to run
        restartScene(false)

        //triggering the "minigame" event. It tells the minigames which minigame to connect to and display a player on.
        this.socket.emit("minigame", "star-collector")

        //event called when "current players" is triggered
        this.socket.on("currentPlayers-sc", (players)=>{
            //create a sqaure for each player currently playing
            Object.keys(players).forEach((id)=>{
                createNewPlayer(game, game.players, players[id], this.gameScale, "player")
            })
        })

        //event called when "new player" is triggered
        this.socket.on("newPlayer-sc", (playerInfo)=>{
            //create a square for a new player joining
            createNewPlayer(game, game.players, playerInfo, this.gameScale, "player")
        })

        //event called when "player updates" is triggered
        this.socket.on("playerUpdates-sc", (players)=>{
            //set the current position of all players
            Object.keys(players).forEach((id)=>{
                game.players.getChildren().forEach((player)=>{
                    if(players[id].playerId === player.playerId){
                        player.setPosition(players[id].x*this.gameScale, players[id].y*this.gameScale)
                        player.anims.play(players[id].animation, true)
                        player.flipX = players[id].flip
                    }
                })
            })
        })
  
        //event called when "star location" is triggered
        this.socket.on('starLocation-sc', (starLocation)=>{
            //create a new star if one doesn't exist otherwise update its position
            if(!game.star){
                //game.star = game.add.star(starLocation.x*this.gameScale, starLocation.y*this.gameScale, 5, 10*this.gameScale, 20*this.gameScale, 0xffff00)
                game.star = game.add.sprite(starLocation.x*this.gameScale, starLocation.y*this.gameScale, "star")
                game.star.setDisplaySize(33*this.gameScale, 33*this.gameScale)
            }
            else{
                game.star.setPosition(starLocation.x*this.gameScale, starLocation.y*this.gameScale)
            }
        })
  
        //event called when "update score" is triggered
        this.socket.on("updateScore-sc", (info)=>{
            if(info.id === game.socket.id){
                game.player.score += 10
            }
            game.currentScores = info.scores
        })

        ////event called when a player disconnects
        this.socket.on("disconnect", (playerId)=>{
            //remove the player who disconnected from the game
            game.players.getChildren().forEach((player)=>{
                if(playerId === player.playerId){
                    player.destroy()
                }
            })
        })
    }
    update(){
        //if there is no player in the game then return
        if(!this.player){return}
  
        //moves the ui text
        moveText(this, this.nameText, this.highscoreTexts, this.player.x, this.gameScale)

        //updates the text displayed on the ui text
        checkTextText(this, this.nameText, this.highscoreTexts, this.currentScores, this.player.name, this.player.score)

        //trigger the "player input" event. Sends which keys are pressed so that the player can be moved correctly
        this.socket.emit('playerInput-sc', {left: this.left.isDown, right: this.right.isDown, up: this.up.isDown})

        //check whether to pause the scene
        checkPause(this, "StarCollector", setCurrentScene)
    }
}

export default StarCollector