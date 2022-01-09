var p;

var running = false;  //the simulation **shouldn't** run until "start" is pressed
var onoff;
var theta1 = 0;//Math.sqrt(.1/205);      // Start angle at PI radians


var text;             //to be used as labels for the graphs
var color;            //simply to make the text colorful



function setup()  {
  canvas=createCanvas(windowWidth,windowHeight);//
  // canvas.parent('sketch-holder');
  pendLength = height/2.5;
  // Make a new Pendulum with an origin location and armlength
  p = new Pendulum(createVector(width/2,100),pendLength, PI/6);

  //labels for the graphs

  // //create the start/stop button
  // onoff = createButton("start");
  // onoff.parent('sketch-holder');
  // onoff.mouseClicked(turnonoff);
  // onoff.position(20,20);
  // onoff.class("sim-button");


  // noLoop();
  pos = p.position;
  vel = createVector(0,0);
  velVector = new Arrow(pos,vel);
  velVector.color = color('green');
  velVector.width = 10;
  velVector.showComponents = false;
  velVector.draggable = false;
  velVector.grab = false;

  accel = createVector(0,0);
  accelVector = new Arrow(pos,vel);
  accelVector.color = color('purple');
  accelVector.width = 10;
  accelVector.showComponents = false;
  accelVector.draggable = false;
  accelVector.grab = false;

  /*********
  Moved from draw() to setup()
  **********/
  background(255);
  push();
  noFill();
  stroke(170)
  arc(width/2,100, 2*pendLength, 2*pendLength,PI/2-PI/6, PI/2+PI/6)
  pop()

  /*********
  3D setting
  **********/
  background3D(111);
  //Controls, only in 3D
  var control = orbitControls()
  control.origin = createVector(860, -90, -264)
  control.target = createVector(width/2,100-5 + 180,0)
  control.enableZoom = false;
  control.enablePan = true;

  fill(color('#ffffff'))
  ambientLight = ambientLight();
  ambientLight.intensity = 0.1

  fill(color('#ffeaa7'))
  floor = createFloor(width/2,500,940,500)
  floor.rotation.x = Math.PI / 2;

  fill(color('#ffffff'))
  spotLight = spotLight(width/2,-340);
  spotLight.target=floor;
  spotLight.angle = Math.PI / 9;
  noFill()
}

function draw() {
  p.go();

  pendVel = createVector(-cos(p.angle),sin(p.angle))
  velVector.origin = p.position;
  // velVector.target = Vector.add(Vector.mult(pendVel,-10000*p.aVelocity),p.position);
  velVector.target = Vector.mult(pendVel,-10000*p.aVelocity)
  velVector.update();
  velVector.display();

  pendAccel = Vector.mult(createVector(-cos(p.angle),sin(p.angle)),-200000*p.aAcceleration);
  tensionDir = Vector.mult(createVector(-sin(p.angle),-cos(p.angle)),200000*sq(p.aVelocity));
  totalAccel = Vector.add(pendAccel,tensionDir);
  accelVector.origin = p.position;

  // accelVector.target = Vector.add(totalAccel,p.position);
  accelVector.target = totalAccel;
  accelVector.update();
  accelVector.display();

}






// //turn the simulation on and off
// function turnonoff() {
//   if (running) {
//     running = false;
//     noLoop();
//     onoff.html("start");
//     return
//   }
//
//   if (!running){
//     running = true;
//     loop();
//     onoff.html("stop");
//     return
//   }
// }
