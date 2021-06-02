//checks if a button has been pressed and then calls the appropriate function attached to the button object if it has been pressed
export function checkButtonPress(game, buttonGroup){
    buttonGroup.children.entries.forEach((button)=>{
        if((game.input.mousePointer.x > button.x-button.width/2 && game.input.mousePointer.x < button.x+button.width/2) && (game.input.mousePointer.y > button.y-button.height/2 && game.input.mousePointer.y < button.y+button.height/2) && game.input.mousePointer.isDown){
            button.callFunction(button.callValue)
        }
    })
}