//checks if a button has been pressed and then calls the appropriate function attached to the button object if it has been pressed
export function checkButtonPress(game, buttonGroup){
    buttonGroup.children.entries.forEach((button)=>{
        if(button.sprite){
            if((game.input.mousePointer.x > button.x-button.w/2 && game.input.mousePointer.x < button.x+button.w/2) && (game.input.mousePointer.y > button.y-button.h/2 && game.input.mousePointer.y < button.y+button.h/2) && game.input.mousePointer.isDown){
                button.anims.play("down"+button.sprite, true)
            }
            else if((game.input.mousePointer.x > button.x-button.w/2 && game.input.mousePointer.x < button.x+button.w/2) && (game.input.mousePointer.y > button.y-button.h/2 && game.input.mousePointer.y < button.y+button.h/2)){
                button.anims.play("over"+button.sprite, true)
            }
            else{
                button.anims.play("off"+button.sprite, true)
            }
        }
        if((game.input.mousePointer.x > button.x-button.w/2 && game.input.mousePointer.x < button.x+button.w/2) && (game.input.mousePointer.y > button.y-button.h/2 && game.input.mousePointer.y < button.y+button.h/2) && game.input.mousePointer.isDown){
            button.callFunction(button.callValue)
        }
    })
}