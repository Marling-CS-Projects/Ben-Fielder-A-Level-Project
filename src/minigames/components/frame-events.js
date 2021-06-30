//moves the text on the screen so that it is visible in the same place to the player at all times
export function moveText(game, mainText, textGroup, playerXPos, scale){
    if(playerXPos > 400*scale){
        if(playerXPos > 1200*scale){
            mainText.setPosition(816*scale, mainText.y)
            for(let i = 0; i < textGroup.children.entries.length; i++){
                textGroup.children.entries[i].setPosition(1300*scale, textGroup.children.entries[i].y)
            }
        }
        else{
            mainText.setPosition(playerXPos-384*scale, mainText.y)
            for(let i = 0; i < textGroup.children.entries.length; i++){
                textGroup.children.entries[i].setPosition(playerXPos+100*scale, textGroup.children.entries[i].y)
            }
        }
    }
    else{
        mainText.setPosition(16*scale, mainText.y)
        for(let i = 0; i < textGroup.children.entries.length; i++){
            textGroup.children.entries[i].setPosition(500*scale, textGroup.children.entries[i].y)
        }
    }
}

//set the text to show the player's score and to update the highscore list.
export function checkTextText(game, mainText, textGroup, scoresList, name, score){
    mainText.setText(name + ": " + score)
    let smallerListLength = Math.min(scoresList.length, textGroup.children.entries.length)
    let i = 0
    for(i; i < smallerListLength; i++){
        textGroup.children.entries[i].setText(scoresList[scoresList.length-(1+i)].name + ": " + scoresList[scoresList.length-(1+i)].score)
    }
    for(i; i < textGroup.children.entries.length; i++){
        textGroup.children.entries[i].setText("")
    }
}

//called every frame to check if the pause button has been pressed
export function checkPause(game, currentMinigame, callFunction){
    if(game.pauseButton.isDown){
        callFunction(currentMinigame)
      game.scene.launch("PauseMenu")
    }
}