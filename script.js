//Values that never change
const FrameRate = 60
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
//Aspect Ratio
var canvasWidth = 600
var canvasHeight = 600
//Inputs
let left = 0
let right = 0
let up = 0
let down = 0
let frame = 0
//Game Attributes
let playerSize = 10
let playerPos = [canvasWidth/2 + playerSize * 1.5, canvasHeight/2  + playerSize * 1.5 ] //Factors in the playersize to get the center coords
let playerSpeed = [0,0]
let acceleration = 0.1
let speedMax = 10
let health = 100
let enemyLocations = []
let enemySpeeds = []
//To get rid of excess console stuff
consoleClear = setInterval(console.clear,5000)
//This displays the endgame dialogue
window.setInterval(function(){
if(health<=0){
    document.getElementById('score').innerHTML =  "Final Score: " + Math.floor(frame/6)/10 + extraz + " seconds! Press F5 to play again!";
}
},1000)
//This is the main game loop. It is set to alive so that you can end the loop with ClearInterval
alive = setInterval(gameLoop,1000/FrameRate)
function endTheGame(){
    clearInterval(consoleClear);
    clearInterval(alive);
}
//This is the function that does the stuff for the game. It is run in the interval above every frame ---------------------------------------------------------------------------------
function gameLoop(){
ctx.clearRect(0,0,canvasWidth + 600,canvasHeight + 600) //This is to clear the board at the start of rendering each frame
drawBackground(); //The background gets rendered first
renderPlayer(); //Then the player
enemies();//And finally the enemies
frame++
if(Math.floor(frame/6)/10 == Math.floor(frame/60)){extraz = ".0"}else{extraz = ""}
    if(health<= 0){
        console.log('endgame');
        endTheGame();
    }
    document.getElementById('score').innerHTML =  "Score: " + Math.floor(frame/6)/10 + extraz
}
//Function that renders the background -------------------------------------------------------------------------------------------------------------------------------------------------
function drawBackground(){
    ctx.fillStyle = 'rgb('+(100 - health)*2.55/10+','+(health)*2.55/10+','+0+')'
    ctx.fillRect((600 - canvasWidth)/2,(600 - canvasHeight)/2,canvasWidth, canvasHeight)
    canvasWidth = 6 * health
    canvasHeight = 6 * health
}
//Rendering the player
function renderPlayer(){
//Getting the player's position and doing movement
playerPos[0] = playerPos[0] + playerSpeed[0]
playerPos[1] = playerPos[1] + playerSpeed[1]
if(Math.abs(playerSpeed[0]) < speedMax){
    playerSpeed[0] = playerSpeed[0] + acceleration * (right - left) - playerSpeed[0] * acceleration * 0.1
}else{playerSpeed[0] = playerSpeed[0] * 0.99}
if(Math.abs(playerSpeed[1]) < speedMax){
    playerSpeed[1] = playerSpeed[1] + acceleration * (down - up) - playerSpeed[1] * acceleration * 0.1
}else{playerSpeed[1] = playerSpeed[1] * 0.99}
//Limiting the Edge
if(playerPos[0]>canvasWidth + playerSize + (600 - canvasWidth)/2){playerSpeed[0] = playerSpeed[0] * -0.8; playerPos[0] = canvasWidth + playerSize + (600 - canvasWidth)/2}
if(playerPos[0]<(600 - canvasWidth)/2 + playerSize * 2){playerSpeed[0] = playerSpeed[0] * -0.8; playerPos[0] = playerSize * 2 + (600 - canvasWidth)/2}
if(playerPos[1]>canvasHeight + playerSize + (600 - canvasHeight)/2){playerSpeed[1] = playerSpeed[1] * -0.8; playerPos[1] = canvasHeight + playerSize + (600 - canvasHeight)/2}
if(playerPos[1]<(600 - canvasHeight)/2 + playerSize * 2){playerSpeed[1] = playerSpeed[1] * -0.8; playerPos[1] = playerSize * 2 + (600 - canvasHeight)/2}
//drawing the player
ctx.fillStyle = 'green'
ctx.fillRect(playerPos[0]-playerSize,playerPos[1]-playerSize,-playerSize,-playerSize)
}
function enemies(){
    let gravityStrength = (frame/200000) + 0.01
    let iteration = 0
    let numEnemies =(frame/800)
    while(numEnemies > iteration){
        if(enemyLocations.length < numEnemies){
            let randomSpeedInitial = [Math.random() * gravityStrength, Math.random() * gravityStrength]
            let randomLocation = [Math.random() * canvasWidth, Math.random() * canvasHeight]
            enemyLocations.push(randomLocation);
            enemySpeeds.push(randomSpeedInitial);
    }
    if(enemyLocations[iteration][0]>(playerPos[0] - playerSize * 2)){angleMult = -1}else{angleMult = 1}
    var angleFromPlayer = Math.atan(((playerPos[1] - playerSize * 2) - enemyLocations[iteration][1])/((playerPos[0] - playerSize * 2) -  enemyLocations[iteration][0]))
    enemySpeeds[iteration][0] = enemySpeeds[iteration][0] + gravityStrength * angleMult * Math.cos(angleFromPlayer)
    enemySpeeds[iteration][1] = enemySpeeds[iteration][1] + gravityStrength * angleMult * Math.sin(angleFromPlayer)
    enemyLocations[iteration][0] = enemyLocations[iteration][0] + enemySpeeds[iteration][0]
    enemyLocations[iteration][1] = enemyLocations[iteration][1] + enemySpeeds[iteration][1]
    netSpeed =  Math.sqrt(enemySpeeds[iteration][0]**2 + enemySpeeds[iteration][1]**2)
    ctx.fillStyle = 'rgb(' + 255 + ',' + 10 ** netSpeed + ',' + 5 ** netSpeed + ')';
    ctx.fillRect(enemyLocations[iteration][0], enemyLocations[iteration][1],10,10)
    let distanceX = (playerPos[0] - playerSize * 2) - enemyLocations[iteration][0]
    let distanceY = (playerPos[1] - playerSize * 2) - enemyLocations[iteration][1]
    if(Math.abs(distanceX)<playerSize&&Math.abs(distanceY)<playerSize){
        health = health - 5
    }else
    console.log(distanceX)
    console.log(distanceY)
    iteration++
    }
    if(health<100){health = health + 0.01}
}
//Detecting what keys are pressed
document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37||event.keyCode == 65){
      left = 1
      console.log('left')
  }
  if(event.keyCode == 38||event.keyCode == 87){
      up = 1
      console.log('up')
  }
  if(event.keyCode == 39||event.keyCode == 68) {
      right = 1
      console.log('right')
  }
  if(event.keyCode == 40||event.keyCode == 83) {
      down = 1
      console.log('down')
  }
})
//detecting when keys are unpressed
document.addEventListener('keyup', function(event) {
  if(event.keyCode == 37||event.keyCode == 65){
      left = 0
      console.log('left')
  }
  if(event.keyCode == 38||event.keyCode == 87){
      up = 0
      console.log('up')
  }
  if(event.keyCode == 39||event.keyCode == 68) {
      right = 0
      console.log('right')
  }
  if(event.keyCode == 40||event.keyCode == 83) {
      down = 0
      console.log('down')
  }
})