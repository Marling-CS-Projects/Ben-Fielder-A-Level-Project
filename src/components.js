import Phaser from "phaser"

export function createNewPlatforms(game, physicsGroup, platformData){
    let newPlatform;
    for(let i = 0; i < platformData.length; i++){
        newPlatform = game.add.rectangle(platformData[i].x, platformData[i].y, platformData[i].w, platformData[i].h, 0x00ff00)
        physicsGroup.add(newPlatform)
    }
}

export function createNewPlayer(game, physicsGroup, x, y){
    let player = game.add.rectangle(x, y, 50, 50, 0xff0000)
    physicsGroup.add(player)
    return player
}

export function createNewPlayers(game, physicsGroup, playerData){
    let player1 = game.add.rectangle(playerData[0].x, playerData[0].y, 50, 50, 0xff0000)
    let player2 = game.add.rectangle(playerData[1].x, playerData[1].y, 50, 50, 0xff0000)
    physicsGroup.add(player1)
    physicsGroup.add(player2)
}

export function createNewKeys(game, keyArray){
    let left = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    let right = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    let up = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    let keyA = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    let keyD = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    let keyW = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyArray = [left, right, up, keyA, keyD, keyW]
    return keyArray
}

export function createNewKeys1(game){
    game.left = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    game.right = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    game.up = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    game.keyA = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    game.keyD = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    game.keyW = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
}

export function createFollowCamera(game, playerToFollow){
    game.cameras.main.setBounds(0, 0, 1600, 600)
    game.cameras.main.startFollow(playerToFollow)
}