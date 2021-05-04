var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
      create: create,
      update: update
    }
};
  
var game = new Phaser.Game(config);

let left
let right
let up
let down
let speed = 1
  
function create (){
    this.r1 = this.add.rectangle(400, 300, 50, 50, 0xff0000)
  
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
}
  
function update(){
    if(left.isDown){
        this.r1.setPosition(this.r1.x-speed, this.r1.y)
    }
    if(right.isDown){
        this.r1.setPosition(this.r1.x+speed, this.r1.y)
    }
    if(up.isDown){
        this.r1.setPosition(this.r1.x, this.r1.y-speed)
    }
    if(down.isDown){
        this.r1.setPosition(this.r1.x, this.r1.y+speed)
    }
}