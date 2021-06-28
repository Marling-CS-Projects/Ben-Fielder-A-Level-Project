/* eslint-disable no-unused-vars */

//handle what to do when the ball and player collide.
function handleBallCollision(player, ball){
    //based on the team of the player, the ball will be rotated.
    if(player.team === "red"){
        ball.setRotation(Math.random()*(-Math.PI/4)-Math.PI/8)
    }
    else{
        ball.setRotation(Math.random()*(-Math.PI/4)-5*Math.PI/8)
    }
    //if the player has hit the interaction button then the ball will move.
    if(player.input.interaction){
        //the velocity of the ball will be based on the rotation of the ball
        ball.body.setVelocityX(ball.speed*Math.cos(ball.rotation))
        ball.body.setVelocityY(250*Math.sin(ball.rotation))
    }
}

//if the ball gets in the goal, then add to team score
function handleGoal(ball, goal){
    ball.body.setVelocityX(0)
    ball.setPosition(Math.random()*400+200, Math.random()*500)
    goal.score += 1
}