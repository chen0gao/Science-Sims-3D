labelArray = [];

function setup()  {
  canvas=createCanvas(windowWidth,windowHeight);
  // frameRate(40);

  p = new ConicalPendulum(createVector(width/2,height / 2),
  10*35, //arm length, m, screen uses pixel, that's why it is super long
  6, //tension, N
  5, //ball mass, kg, related to ball size
);

//Create vectors
pos = p.position;
vel = createVector(0,0);
velVector = new Arrow(pos,vel);
velVector.color = color('green');

accelVector = new Arrow(pos,vel);
accelVector.color = color('purple');

tensionVector = new Arrow(pos,vel);
tensionVector.color = color('yellow');

gravVector = new Arrow(pos,vel);
gravVector.color = color('red');

/*********
Moved from draw() to setup()
**********/
background(255);

//The path of conical pendulum
push();
noFill();
stroke(170)
path = ellipse(width / 2, height / 2, p.r*2, p.r*2); //use width & height so r*2
pop()

//The area for angle theta
push();
stroke(170)
fill('rgba(226, 230, 231, 0.1)')
thetaLength = 80
thetaArea = ellipse(width / 2, height / 2, thetaLength, thetaLength,0,THREE.Math.degToRad(p.angle));
thetaArea.center(); //Make translation absolute
thetaArea.rotation.z = PI/2
thetaArea.rotation.x = 3*PI/2
thetaArea.position.z = p.height - 20;
thetaArea.update()
pop()

//label
text('θ','blue',10,labelArray)
text('V','green',16,labelArray)
text('a','purple',16,labelArray)
text('W','red',16,labelArray)
text('T','yellow',16,labelArray)

/*********
3D setting
**********/
background3D(111);
//Controls, only in 3D
initOffset = 30
var control = orbitControls()
control.origin = createVector(width / 2, height / 2 + 649, p.height)
control.target = createVector(width / 2, height / 2, p.height/2-initOffset)
control.enableZoom = false;
control.enablePan = true;

p.go(); //Update once to apply 3d material
darkMode(); //Toggle 3D initially


fill(color('#ffffff'))
ambientLight = ambientLight();
ambientLight.intensity = 0.1

fill(color('#ffeaa7'))
floor = createFloor(width/2,height/2,1000,1000)
floor.position.z = -300

fill(color('#ffffff'))
spotLight = spotLight(width/2,height/2);
spotLight.position.z = 800
spotLight.target=floor;
spotLight.distance = 1200
noFill()
}



function draw() {
  p.go();

  thetaArea.rotation.y = PI/2+p.rotateAngle
  thetaArea.position.x = width / 2 + 11 * sin(p.rotateAngle)
  thetaArea.position.y = height / 2 + 11 * cos(p.rotateAngle)
  thetaArea.update()

  velDir = createVector(cos(p.rotateAngle),-sin(p.rotateAngle))
  velVector.origin = p.position
  velVector.target = Vector.mult(velDir,10*p.velocity) // *10 to make vector visible
  velVector.update();
  velVector.display();

  accelVector.origin = p.position
  accelDir = createVector(sin(p.rotateAngle),cos(p.rotateAngle))
  accelVector.target = Vector.mult(accelDir,-10*p.centripetalForce)
  accelVector.update();
  accelVector.display();

  gravVector.origin = p.position
  gravDir = createVector(0,0,-1)
  gravVector.target = Vector.mult(gravDir,10*p.gravForce)
  gravVector.update();
  gravVector.display();

  tensionVector.origin = p.position
  tensionDir_norm = ((-p.r * sin(p.rotateAngle))**2 + (-p.r * cos(p.rotateAngle))**2 + (p.height)**2)**(1/2)
  tensionDir = createVector(-p.r * sin(p.rotateAngle),-p.r * cos(p.rotateAngle),p.height)
  tensionDir = Vector.mult(tensionDir,1/tensionDir_norm)
  tensionVector.target = Vector.mult(tensionDir,10*p.tension)//
  tensionVector.update();
  tensionVector.display();


  //label position
  valueArray = [thetaArea,velVector,accelVector,gravVector,tensionVector]
  for(let i = 0;i<labelArray.length;i++) {

    if(labelArray[i]) {
      //rotate the label to make it visible to the camera
      labelArray[i].center(); //Make translation absolute
      labelArray[i].rotation.z = PI
      labelArray[i].rotation.x = 3*PI/2

      //index 0 in labelArray is the label for theta
      if(i==0) {
        labelArray[i].position.z = p.height - 30;

        labelArray[i].rotation.y = PI/2+p.rotateAngle
        labelArray[i].position.x = width / 2 + 5 * sin(p.rotateAngle)
        labelArray[i].position.y = height / 2 + 5 * cos(p.rotateAngle)
      } else {
        var offset = (valueArray[i]==gravVector) ? -20 : 10;

        labelArray[i].position.set(p.position.x + valueArray[i].target.x,
          p.position.y + valueArray[i].target.y,
          p.position.z + valueArray[i].target.z + offset)
        }

      }
    }
}
