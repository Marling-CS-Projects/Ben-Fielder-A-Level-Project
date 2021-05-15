//this is called when a player and button collide. obj2 refers to the button
export function handleButtonPress(obj1, obj2){
    obj2.on = true
}

//this is called when a player and lever collide. It turns the lever on or off if the interaction key has been pressed
export function handleLeverPress(obj1, obj2){
    if(obj1.interactionKey.isDown && !obj1.interactionKey.pressed){
        obj1.interactionKey.pressed = true
        if(Math.round(obj2.rotation,5) === Math.round(45*Math.PI/180,5)){
            obj2.setRotation(-45*Math.PI/180)
            obj2.on = false
        }
        else{
            obj2.setRotation(45*Math.PI/180)
            obj2.on = true
        }
    }
}