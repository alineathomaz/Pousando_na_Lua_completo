var ground;
var lander;
var lander_img;
var bg_img;
var thrust,crash,land;
var rcs_left;
var rcs_right;
var obs;
var vx = 0;
var vy = 0;
var g = 0.05;
var fuel = 100;
var timer;
var obstacle_img;
var lz_img;

function preload()
{
  lander_img = loadImage("./assets/normal.png");
  bg_img = loadImage("./assets/bg.png");
  thrust = loadAnimation("./assets/b_thrust_1.png","./assets/b_thrust_2.png","./assets/b_thrust_3.png");
  crash= loadAnimation("./assets/crash1.png","./assets/crash2.png","./assets/crash3.png");
  land = loadAnimation("./assets/landing1.png" ,"./assets/landing2.png","./assets/landing_3.png");
  rcs_left = loadAnimation("./assets/left_thruster_1.png","./assets/left_thruster_2.png");
  normal = loadAnimation("./assets/normal.png");
  rcs_right = loadAnimation("./assets/right_thruster_1.png","./assets/right_thruster_2.png");
  obstacle_img = loadImage("./assets/obstacle.png");
  lz_img = loadImage("./assets/lz.png");

  thrust.playing= true;
  thrust.looping= false;
  land.looping = false;
  crash.looping = false; 
  rcs_left.looping = false;
  rcs_right.looping = false;
}

function setup() 
{
  createCanvas(1000,700);
  frameRate(80);
  timer = 1500;

  thrust.frameDelay = 5;
  land.frameDelay = 5;
  crash.frameDelay = 10;
  rcs_left.frameDelay = 5;

  lander = createSprite(100,50,30,30);
  lander.addImage(lander_img);
  lander.scale = 0.1;
  lander.setCollider("rectangle",0,0,200,200)

  lander.addAnimation('thrusting',thrust);
  lander.addAnimation('crashing',crash);
  lander.addAnimation('landing',land);
  lander.addAnimation('left',rcs_left);
  lander.addAnimation('normal',normal);
  lander.addAnimation('right',rcs_right);

  obs = createSprite(320,530,50,100);
  obs.addImage(obstacle_img);
  obs.scale = 0.5;
  obs.setCollider("rectangle",0,100,300,300);

  ground = createSprite(500,700,1000,10);

  lz = createSprite(880,610,50,30);
  lz.addImage(lz_img);
  lz.scale = 0.3;

  lz.setCollider("rectangle",0,180,400,100)
  rectMode(CENTER);
  textSize(15);
}

function draw() 
{
  background(51);
  image(bg_img,0,0);
  push()
  fill(255);
  text("Horizontal Velocity: " +round(vx,2),800,50);
  text("Fuel: "+fuel,800,25);
  text("Vertical Velocity: "+round(vy),800,75);
  pop();

  //fall down
  vy +=g;
  lander.position.y+=vy;
  lander.position.x +=vx;

  //obstacle detection
  if(lander.collide(obs)==true)
  {
    lander.changeAnimation('crashing');
    stop();
  }

  //landing detection;
  var d = dist(lander.position.x,lander.position.y,lz.position.x,lz.position.y);
  
  if(d<=15)
  {
    console.log("landed");
    vx = 0;
    vy = 0;
    g=0;
    lander.changeAnimation('landing');
    lander.x = 880;
    lander.y = 620;
  }

  if(lander.collide(ground)==true)
  {
    console.log("collided");
    lander.changeAnimation('crashing');
    vx = 0;
    vy = 0;
    g = 0;
  }

  drawSprites();
}

function keyPressed()
{
  if(keyCode==UP_ARROW && fuel>0)
  {
    upward_thrust();
    lander.changeAnimation('thrusting');
    thrust.nextFrame();
    
  }
  
  if(keyCode==RIGHT_ARROW && fuel>0)
  {
    lander.changeAnimation('left');
    right_thrust();
  }

  if(keyCode==LEFT_ARROW && fuel>0)
  {
    lander.changeAnimation('right');
    left_thrust();
  }
}

function upward_thrust()
{
  vy = -1;
  fuel-=1;
}

function right_thrust()
{ 
  vx += 0.2;
  fuel -=1;
}

function left_thrust()
{
  vx -= 0.2;
  fuel-=1;
}

function stop()
{
  vx = 0;
  vy = 0;
  fuel = 0;
  g = 0;
}