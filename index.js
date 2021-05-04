var config = {
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
    scene: {
      create: create,
      update: update
    }
};

var game = new Phaser.Game(config);
  
let left
let right
let up

function create (){
    this.players = this.physics.add.group()
    this.player = this.add.rectangle(400, 525, 50, 50, 0xff0000)
    this.players.add(this.player)
  
    this.platforms = this.physics.add.staticGroup()
    this.p1 = this.add.rectangle(400, 575, 800, 50, 0x00ff00)
    this.p2 = this.add.rectangle(100, 450, 200, 50, 0x00ff00)
    this.p3 = this.add.rectangle(400, 310, 300, 50, 0x00ff00)
    this.p4 = this.add.rectangle(150, 160, 150, 50, 0x00ff00)
    this.p5 = this.add.rectangle(650, 200, 100, 50, 0x00ff00)
    this.platforms.add(this.p1)
    this.platforms.add(this.p2)
    this.platforms.add(this.p3)
    this.platforms.add(this.p4)
    this.platforms.add(this.p5)
  
    this.physics.add.collider(this.player, this.platforms)
  
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
}
  
function update(){
    if(left.isDown){
        this.player.body.setVelocityX(-100)
    }
    else if(right.isDown){
        this.player.body.setVelocityX(100)
    }
    else{
        this.player.body.setVelocityX(0)
    }
    if(up.isDown && this.player.body.touching.down){
        this.player.body.setVelocityY(-300)
    }
}