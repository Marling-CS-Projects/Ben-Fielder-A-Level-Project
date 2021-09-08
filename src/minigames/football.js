/* eslint-disable no-undef */
//importing Phaser library
import Phaser from "phaser"

//import functions for use in the scene
import { createNewGoal, createNewPlatforms, createNewPlayer } from "./components/components";

//importing function from game 2 in order to restart it
import {restartScene} from "../game2"

//functions used to pause the scene
import { checkPause } from "./components/frame-events";
import { setCurrentScene } from "../menus/pause-menu";

//The Football minigame scene. the create function is called at the start of the scene and the update function is called every frame
class Football extends Phaser.Scene{
    constructor(){
        super("Football")
    }
    preload(){
        //loading all the sprites for use in the level
        this.load.image("player", "player/stand.png")
        this.load.image("player1r", "player/walk1r.png")
        this.load.image("player2r", "player/walk2r.png")

        this.load.image("grass", "ground/grass.png")
        this.load.image("grass-wall", "ground/grass-wall.png")

        this.load.image("football", "football/football.png")
        
        this.load.image("goal", "football/goal.png")

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

        this.add.sprite(400*this.gameScale, 300*this.gameScale, "background").setDisplaySize(1024*this.gameScale, 1024*this.gameScale).setDepth(-1)
        
        //this is the socket.io reference
        this.socket = io()
        console.log(this.socket)

        //creating the players group
        this.players = this.add.group()

        //creating the platforms group and platforms
        this.platforms = this.add.group()
        let platformData = [{x:400,y:575,w:800,h:50},{x:-5,y:400,w:10,h:1000},{x:805,y:400,w:10,h:1000},{x:400,y:-5,w:800,h:10}]
        createNewPlatforms(this, this.platforms, platformData, this.gameScale, "grass")

        //creating the goals
        this.goals = this.add.group()
        this.redGoal = createNewGoal(this, this.goals, {x:790, y:500}, this.gameScale, "goal", true)
        this.blueGoal = createNewGoal(this, this.goals, {x:10, y:500}, this.gameScale, "goal", false)

        //setting the team scores
        this.redScore = 0
        this.blueScore = 0

        //creating the display text for the team scores
        this.redScoreText = this.add.text(125*this.gameScale, 50*this.gameScale, "Red: " + this.redScore, {font: "60px Future", fill: "#ff0000"}).setOrigin(0.5, 0.5)
        this.blueScoreText = this.add.text(675*this.gameScale, 50*this.gameScale, "Blue: " + this.blueScore, {font: "60px Future", fill: "#0000ff"}).setOrigin(0.5, 0.5)

        //setting the camera bounds
        this.cameras.main.setBounds(0, 0, 800*this.gameScale, 600*this.gameScale)

        //creating the key listeners
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.interaction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACK_SLASH)
        this.pauseButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)

        //restart game 2 and tell it not to run
        restartScene(false)

        //triggering the "minigame" event. It tells the minigames which minigame to connect to and display a player on.
        this.socket.emit("minigame", "football")

        //event called when "current players" is triggered
        this.socket.on("currentPlayers-fb", (players)=>{
            //create a sqaure for each player currently playing
            Object.keys(players).forEach((id)=>{
                createNewPlayer(game, game.players, players[id], this.gameScale, "player")
            })
        })
  
        //event called when "new player" is triggered
        this.socket.on("newPlayer-fb", (playerInfo)=>{
            //create a square for a new player joining
            createNewPlayer(game, game.players, playerInfo, this.gameScale, "player")
        })

        //event called when "player updates" is triggered
        this.socket.on("playerUpdates-fb", (players)=>{
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
        this.socket.on('ballLocation-fb', (ballLocation)=>{
            //if there isn't a player in the game then the ball won't be created. This means that the ball will be rendered over the player.
            if(!game.player){return}
            //create a new star if one doesn't exist otherwise update its position
            if(!game.ball){
                //game.ball = game.add.circle(ballLocation.x*this.gameScale, ballLocation.y*this.gameScale, 18*this.gameScale, 0xffff00)
                game.ball = game.add.sprite(ballLocation.x*this.gameScale, ballLocation.y*this.gameScale, "football")
                game.ball.setDisplaySize(36*this.gameScale, 36*this.gameScale)
            }
            else{
                game.ball.setPosition(ballLocation.x*this.gameScale, ballLocation.y*this.gameScale)
            }
        })
  
        //event called when "update score" is triggered
        this.socket.on("updateScores-fb", (info)=>{
            //setting the red team's score and writing it to the text
            game.redScore = info.red
            game.redScoreText.setText("Red: " + game.redScore)
            //setting the blue team's score and writing it to the text
            game.blueScore = info.blue
            game.blueScoreText.setText("Blue: " + game.blueScore)
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

        //trigger the "player input" event. Sends which keys are pressed so that the player can be moved correctly
        this.socket.emit('playerInput-fb', {left: this.left.isDown, right: this.right.isDown, up: this.up.isDown, interaction: this.interaction.isDown})

        //check whether to pause the scene
        checkPause(this, "Football", setCurrentScene)
    }
}

export default Football