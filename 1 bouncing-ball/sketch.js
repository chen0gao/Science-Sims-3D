
function setup() {
  createCanvas(800, 500);
  background(250);
  frameRate(30);

  //choose random vectors for the balls initial motion
  pos = createVector(random(0,width/2),random(.2*height,.8*height))
  vel = createVector(random(3,5),random(-1,1));
  accel = createVector(0,0);

  //what is gravity?
  gravity = createVector(0,1);

  //make the ball! It is an instance of the mover object
  ball = new KineticMass(pos,vel,accel,20,'red');
  ball.tail = true;
  ball.outline = 'black';
  ball.tailStroke = 'red';
  ball.tailFill = 'red';
  //This will be the position vector

  //And this will be the velocity vector
  velVector = new Arrow(pos,vel);
  velVector.color = color('green');
  velVector.width = 10;
  velVector.showComponents = false;
  velVector.draggable = false;
  velVector.grab = false;

  accelVector = new Arrow(pos,gravity); //accel
  accelVector.color = color('purple');
  accelVector.width = 10;
  accelVector.showComponents = false;
  accelVector.draggable = false;
  accelVector.grab = false;

  //For 3D
  background3D(11);

  fill(color('#ffffff'))
  ambientLight = ambientLight();
  ambientLight.intensity = 0.1

  fill(color('#ffffff'))
  floor = createFloor(400,500,800,500)
  floor.rotation.x = Math.PI / 2;

  fill(color('#ffffff'))
  spotLight = spotLight(width/2,-200);
  spotLight.target=floor;
  spotLight.angle = Math.PI / 7;
  noFill()
}

function draw() {
  // background(250);
  ball.applyForce(gravity);
  //update the position
  ball.update();
  //make the ball bounce
  ball.wrapEdgesBounceFloor();
  //display changes
  ball.display();

  //update the position vector by setting its target to be equal to the balls position



  //the velocity vector will start where the ball is (i.e ball.position) and point in the direction of the velocity
velVector.origin = ball.position
velVector.target = Vector.mult(ball.vel,15); //
velVector.update()
velVector.display();

accelVector.origin = ball.position
//the acceleration is very small, so we need to multiply it by a big number to see the arrow length
accelVector.target = Vector.mult(ball.accel,1500); //
accelVector.update()
accelVector.display();

}
