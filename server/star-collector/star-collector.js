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
let players = {}

function create(){
  //this is needed when writing code within socket events as "this" won't refer to the game
  let game = this

  //creating the players physics group
  this.players = this.physics.add.group()

  //creating the platforms physics group and the platforms
  this.platforms = this.physics.add.staticGroup()
  let platformData = [{x:800,y:575,w:1600,h:50},{x:-5,y:400,w:10,h:1000},{x:1605,y:400,w:10,h:1000},
    {x:100,y:450,w:200,h:50},{x:675,y:450,w:150,h:50},{x:1150,y:450,w:200,h:50},{x:1375,y:400,w:150,h:50},
    {x:350,y:325,w:200,h:50},{x:175,y:175,w:100,h:50},{x:650,y:175,w:300,h:50},{x:950,y:100,w:50,h:50},
    {x:900,y:375,w:200,h:50},{x:1150,y:225,w:200,h:50},{x:1450,y:175,w:300,h:50}]
  createNewPlatforms(this, this.platforms, platformData)

  //creating the star and giving it a random position
  this.stars = this.physics.add.group()
  this.star = this.add.star(Math.random()*1500+50, Math.random()*500, 5, 10, 20, 0xffff00)
  this.stars.add(this.star)

  //setting an overlap event between the players and the star
  this.physics.add.overlap(this.players, this.star, (star, player)=>{
    game.star.setPosition(Math.floor(Math.random()*1500)+50, Math.random()*500)
    players[player.playerId].score += 10
    bubbleSortScores(game, players)
    io.emit("updateScore-sc", {id: player.playerId, scores: game.soretedScores})
  });

  //setting colliders
  this.physics.add.collider(this.players, this.platforms)
  this.physics.add.collider(this.stars, this.platforms)

  //the list to contain the ordered scores
  this.soretedScores = []

  //this is called when a player connects to the server
  io.on("connection", (socket)=>{
    //this is called when the minigame event is triggered
    socket.on("minigame", (minigame)=>{
      //if the player is connecting to the star-collector minigame then create a player for them
      if(minigame === "star-collector"){
        //add a new player to the players object
        players[socket.id] = {
          name: nameGenerator().dashed,
          score: 0,
          x: Math.floor(Math.random() * 1500) + 50,
          y: Math.floor(Math.random() * 500),
          playerId: socket.id,
          input: {
            left: false,
            right: false,
            up: false
          },
          animation: "rest",
          flip: false
        }
        //add the player to the game
        addPlayer(game, players[socket.id])
        //triggers the current players event on the curret socket
        socket.emit("currentPlayers-sc", players)
        //emit the new player event to all connected sockets
        socket.broadcast.emit("newPlayer-sc", players[socket.id])
        //emit the star location event to current socket
        socket.emit("starLocation-sc", {x: game.star.x, y: game.star.y})
      }
    })

    //this is called when the player input event is triggered
    socket.on("playerInput-sc", (inputData)=>{
      handlePlayerInput(game, players, socket.id, inputData)
    })

    //this is called when a player disconnects
    socket.on("disconnect", ()=>{
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
  io.emit("playerUpdates-sc", players)
  //trigger the star location event
  io.emit("starLocation-sc", {x: this.star.x, y: this.star.y})
}