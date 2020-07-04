var trex//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,restart,gameOverimg,restartimg
var jump,die,checkpoint

var trex_running
var ground
var groundimg
var invisibleground
var Cloudimage
var CloudsGroup
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6
var ObstaclesGroup
var count
function preload(){
 trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  groundimg=loadImage("ground2.png");
  Cloudimage=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  gameOverimg=loadImage("gameOver.png");
  restartimg=loadImage("restart.png");
  jump=loadSound("jump.mp3");
  die=loadSound("die.mp3");
  checkpoint=loadSound("checkPoint.mp3");
  trex_collided=loadAnimation("trex_collided.png");
}  
function setup() {
  createCanvas(600,200);
  trex=createSprite(50,180,10,10);
 trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.5;
  
  ground=createSprite(200,180,400,20);
ground.addImage("ground",groundimg);
 
  ground.x=ground.width/2;
  
  invisibleground=createSprite(200,190,400,10);
  invisibleground.visible=false
  
  CloudsGroup=new Group();
  ObstaclesGroup=new Group();
  
  count=0;
  //place gameOver and restart icon on the screen
 gameOver = createSprite(300,100);
 restart = createSprite(300,140);
gameOver.addImage(gameOverimg);
gameOver.scale = 0.5;
restart.addImage(restartimg);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

}


function draw() {
  background("white");
  trex.collide(invisibleground);
  if(gameState===PLAY){
  if(ground.x<0){
    ground.x=ground.width/2}
     ground.velocityX=-3;
  
  if(keyDown("space")&&trex.y>160){
    trex.velocityY=-12
    jump.play()
  }
   if (count>0 && count%100 === 0){
    checkpoint.play()
    }
    trex.velocityY=trex.velocityY+0.8;
  spawnClouds();
  spawnObstacles();
  
  count=count+Math.round(getFrameRate()/60)

   if(ObstaclesGroup.isTouching(trex)){
    die.play()
      gameState = END;
      
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  text("score: "+count,500,50);
  
  drawSprites();
}
function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  count = 0;
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y =Math.round(random(80,120));
    cloud.addImage(Cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand =Math.round( random(1,6));
    
    switch(rand){
        case 1: obstacle.addImage(obstacle1);
        break;
        case 2: obstacle.addImage(obstacle2);
        break;
        case 3: obstacle.addImage(obstacle3);
        break;
        case 4: obstacle.addImage(obstacle4);
        break;
        case 5: obstacle.addImage(obstacle5);
        break;
        case 6: obstacle.addImage(obstacle6);
        break;
        default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}