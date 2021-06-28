/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

//configuration for the Phaser game
let config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 300 }
    }
  },
  scene: {
    create: create,
    update: update
  },
  //autofocus is disabled as it is not running on an actual display
  autoFocus: false
}

//starts the game
let game = new Phaser.Game(config)

//an object to store the players
let players = {};

function create(){
  //this is needed when writing code within socket events as "this" won't refer to the game
  let game = this

  //creating the players physics group
  this.players = this.physics.add.group()

  //creating the platforms physics group and the platforms
  this.platforms = this.physics.add.staticGroup()
  let platformData = [{x:400,y:575,w:800,h:50},{x:-5,y:400,w:10,h:1000},{x:805,y:400,w:10,h:1000},{x:400,y:-5,w:800,h:10}]
  createNewPlatforms(this, this.platforms, platformData)

  //creating the ball
  this.balls = this.physics.add.group()
  this.ball = createNewBall(this, this.balls, {x:Math.random()*400+200,y:Math.random()*500,r:18},400,100)

  //creating the goals
  this.goals = this.physics.add.staticGroup()
  this.redGoal = createNewGoal(this, this.goals, {x:790,y:500})
  this.blueGoal = createNewGoal(this, this.goals, {x:10,y:500})

  //setting colliders
  this.physics.add.collider(this.players, this.platforms)
  this.physics.add.collider(this.balls, this.platforms)

  //adding the overlap events for the ball
  this.physics.add.overlap(this.players, this.balls, handleBallCollision)
  this.physics.add.overlap(this.balls, this.goals, handleGoal)

  //this is called when a player connects to the server
  io.on("connection", (socket)=>{
    //this is called when the minigame event is triggered
    socket.on("minigame", (minigame)=>{
      //if the player is connecting to the football minigame then create a player for them
      if(minigame === "football"){
        //add a new player to the players object
        players[socket.id] = {
          name: nameGenerator().dashed,
          score: 0,
          x: Math.floor(Math.random() * 400) + 400,
          y: Math.floor(Math.random() * 500),
          playerId: socket.id,
          input: {
            left: false,
            right: false,
            up: false,
            interaction: false
          },
          team: (Math.floor(Math.random() * 2) === 0) ? "red" : "blue"
        }
        //add the player to the game
        addPlayer(game, players[socket.id])
        //triggers the current players event on the curret socket
        socket.emit("currentPlayers-fb", players)
        //emit the new player event to all connected sockets
        socket.broadcast.emit("newPlayer-fb", players[socket.id])

        socket.emit("ballLocation-fb", game.ball)
      }
    })

    //this is called when the player input event is triggered
    socket.on("playerInput-fb", (inputData)=>{
      handlePlayerInput(game, players, socket.id, inputData)
    })

    //this is called when a player disconnects
    socket.on("disconnect", ()=>{
      //console.log('user disconnected')
      removePlayer(game, socket.id)
      delete players[socket.id]
      io.emit("disconnect", socket.id)
    });
  });
}

function update(){
  //update the player's velocity based on current input
  updatePlayerVelocity(this, players)

  //emit the player updates event
  io.emit('playerUpdates-fb', players)

  //emit the ball location event
  io.emit("ballLocation-fb", this.ball)

  //emit the update scores event
  io.emit("updateScores-fb", {red:this.redGoal.score, blue:this.blueGoal.score})
}