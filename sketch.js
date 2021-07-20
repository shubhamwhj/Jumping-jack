var num=15
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var direction
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var obstaclesGroup, platform1

var score=0;
var jumpSound , checkPointSound, dieSound;
var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  platform1 = loadImage("p1.png");

  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(500, 500);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.setCollider("circle",0,30,10);
  trex.debug=true
  trex.depth=10000
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(250,390,600,10);
  //invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("black");
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    //trex.collide(obstaclesGroup)
    score = score + Math.round(frameCount/60);
    
    //change the trex animation
    trex.changeAnimation("running", trex_running);
    
    // //jump when the space key is pressed
    if(obstaclesGroup.isTouching(trex) && trex.velocityY>5) {
      trex.velocityY = -16;
       jumpSound.play();
    }
    
    if(keyDown("space")) {
      trex.velocityY = -16;
       jumpSound.play();
      invisibleGround.velocityY=2
    }
 
    if(keyDown("left"))
      {
        trex.x-=5
      }
    
    if(keyDown("right"))
      {
        trex.x+=5
      }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
    trex.collide(invisibleGround);
    spawnObstacles();
  
    if(trex.y>500){
        gameState = END;
       dieSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0  
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);   
  }
  
  obstaclesGroup.displace(invisibleGround)
  
  drawSprites();
}





function spawnObstacles() {
  if(frameCount % num === 0) {
    xx=Math.round(random(0,500))
    var obstacle = createSprite(xx,-10,150,20);
    //obstacle.debug = true;
    obstacle.velocityY = 2;
    //obstacle.debug=true
    obstacle.depth=0
    obstacle.addImage(platform1);
 
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.setCollider("rectangle",30,-100,600,20);
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
    if(frameCount%10==0)
      {
        num =num+10
      }
  }
}

