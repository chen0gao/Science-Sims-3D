/****************
 * Create some default values as placeholder
 */
speedSlider = {
  value: function() {
    return 275
  }
}

angleSlider = {
  value: function() {
    return 0
  }
}


var planet;
var Orbiters = [];
var Trails = [];
//var VertzOfAreas = [];
var launch;
var speedSlider, angleSlider;
var mass;
var h;
var c;
var count;
let orbitCenter;

function setup() {
  canvas=createCanvas(windowWidth, windowHeight*.9);
  // canvas.parent('sketch-holder');

  frameRate(30);

  mass = 400;
  h = 80;
  c = 0;
  count = 0;



  // launch = createButton("launch");
  // launch.parent('sketch-holder');
  // launch.mouseClicked(launchOrbiter);
  // launch.position(width*.7,height*.05);
  // launch.class("sim-button");
  // speedSliderLabel = createP("Speed");
  // speedSliderLabel.parent('sketch-holder');
  // speedSliderLabel.position(30,0);
  // speedSlider = createSlider(0, 400,260 ,0);
  // speedSlider.parent('sketch-holder');
  // speedSlider.position(30,20);
  // speedSlider.class("sim-slider");
  // speedSlider.size(150,50)
  // angleSliderLabel = createP("Direction");
  // angleSliderLabel.parent('sketch-holder');
  // angleSliderLabel.position(30,60);
  // angleSlider = createSlider(0, 360, 0 ,0);
  // angleSlider.parent('sketch-holder');
  // angleSlider.position(30,90);
  // angleSlider.class("sim-slider");
  // angleSlider.size(150,50)



  orbitCenter = createVector(width/2,h + 40)

  aVector = new Arrow(createVector(orbitCenter.x,orbitCenter.y-h),createVector(0,0));
  aVector.color = color('red');
  aVector.grab = false;
  aVector.draggable = false;
  aVector.showComponents = false;
  aVector.width=10;


  /****************
   * Move some functions in draw() to setup() since Threejs only need to create those objects once
   */
  count++;
  background(255);
  push();
  fill('yellow');
  stroke(0);
  planet = sphere(orbitCenter.x,orbitCenter.y,20,20)
  planet.color('#e5bc29')


  pop();
  aVector.origin.x = orbitCenter.x;
  aVector.origin.y = orbitCenter.y-h;
  aVector.target.x = //orbitCenter.x+
                    .5*speedSlider.value()*cos(angleSlider.value()*Math.PI/180)
  aVector.target.y = //orbitCenter.y - h+
                    .5*speedSlider.value()*sin(angleSlider.value()*Math.PI/180)
  aVector.update();
  aVector.display();

  launchOrbiter(); //Auto start the sims

  /****************
   * add accelerate vector
   */
  let gravityVector = grav(aVector.origin)
  //the acceleration is very small, so we need to multiply it by a big number to see the arrow length
  let bigNumber = 1500
  accVector = new Arrow(createVector(aVector.origin.x,aVector.origin.y),createVector(gravityVector.x*bigNumber,gravityVector.y*bigNumber));
  accVector.color = color('green');
  accVector.grab = false;
  accVector.draggable = false;
  accVector.showComponents = false;
  accVector.width=10;


    //Light
    fill(color('#F8FF91'))
    pointLight(orbitCenter.x,orbitCenter.y);
    noFill()

    fill(color('#ffffff'))
    spotLight = spotLight(width/2,-200);
    spotLight.target=planet;
    spotLight.angle = Math.PI / 7;
    noFill()


    //Controls, only in 3D
    background3D(30)
    var control = trackballControls();
    control.origin = createVector(157,446,-480)
    control.target = createVector(orbitCenter.x,orbitCenter.y, 0)

    /****************
     * Draw complete orbit at beginning
     */

    var full_orbit = new Orbiter(orbitCenter.x, orbitCenter.y - h, speedSlider.value()*cos(angleSlider.value()*Math.PI/180), speedSlider.value()*sin(angleSlider.value()*Math.PI/180));
    let firstPoint = full_orbit.position.copy();
    let threshold = 1
    let converge = false;
    for (let i = 0;i<100000;i++) {
      if(i==0) continue //skip first point
          full_orbit.gravity = grav(full_orbit.position); //current gravity acceleration
          full_orbit.velgrav = full_orbit.velocity; //current  velocity
          full_orbit.velgrav.add(full_orbit.gravity); //new velocity after gravity acceleration
          full_orbit.position.add(full_orbit.velgrav); //new position after new velocity
          currentPos = full_orbit.position.copy();
          full_orbit.VertzOfAreas.push(currentPos);
          if(i>30) {
            if(distance(firstPoint,currentPos)<threshold) {
                console.log(distance(firstPoint,currentPos))
                console.log('break at '+i)
                converge = true;
              break;
              }
          }
    }

    if(!converge) return;

    fill('rgba(226, 230, 231, 0.1)');
    beginShape();
    vertex(firstPoint.x,firstPoint.y)

    for (let i=0; i<full_orbit.VertzOfAreas.length; i++){
      vertex(full_orbit.VertzOfAreas[i].x,full_orbit.VertzOfAreas[i].y)
    }

    vertexCircleHole(orbitCenter.x,orbitCenter.y,20+5, 0, Math.PI * 2)

    endShape(CLOSE);

}




function draw() {

  fill(150);
  noStroke();
  for (let i = Orbiters.length-1; i >= 0; i--){ //Need to add let i; else will treat i as global variable
    a = Orbiters[i];
    a.drawOrbiter();
    a.drawAreas();

    dis = distance(a.position, orbitCenter);
    if ( dis < 10 || dis > 2000){
      Orbiters.splice(i,1);
    }
  }
  for (let i = Trails.length-1; i >= 0; i--) {
    var p = Trails[i];
    p.run();
    if (p.isDead()) {
      //remove the particle
      p.ellipse.remove(); //Ellipse won't be auto removed, so needs to call the remove function
      Trails.splice(i, 1);
    }
  }


  /****************
   * update the velocity & acceleration vector
   */
  if(!aVector.ratio) {
   //Find the unit vector for first time, to calibrate the length of vector
    new_velocity_norm = ((Orbiters[0].velgrav.x)**2 + (Orbiters[0].velgrav.y)**2 )**(1/2)
    aVector.ratio = new_velocity_norm
  }

  aVector.origin.x = Orbiters[0].position.x;
  aVector.origin.y = Orbiters[0].position.y;
  aVector.target.x = Orbiters[0].velgrav.x/aVector.ratio * .5*speedSlider.value();
  aVector.target.y = Orbiters[0].velgrav.y/aVector.ratio * .5*speedSlider.value();
  aVector.update();
  aVector.display();

  let gravityVector = grav(aVector.origin)
  //the acceleration is very small, so we need to multiply it by a big number to see the arrow length
  let bigNumber = 1500
  accVector.origin.x = aVector.origin.x
  accVector.origin.y = aVector.origin.y
  accVector.target.x = gravityVector.x*bigNumber
  accVector.target.y = gravityVector.y*bigNumber
  accVector.update();
}

function distance(pos, pos2){
  return sqrt(((pos.x-pos2.x)*(pos.x-pos2.x))+((pos.y-pos2.y)*(pos.y-pos2.y)));
}

 grav = function(pos,scale){
   direction = createVector(orbitCenter.x - pos.x, orbitCenter.y - pos.y);
   direction.normalize();
   d = distance(pos, orbitCenter);
   direction.mult(mass/(d*d));

   return direction;
 }


  var Orbiter = function(px, py, vx, vy){
  this.position = createVector(px, py);
  this.velocity = createVector(vx/100, vy/100);
  this.VertzOfAreas = [];
  }

Orbiter.prototype.drawOrbiter = function(){
    this.gravity = grav(this.position); //current gravity acceleration
    this.velgrav = this.velocity; //current velocity
    this.velgrav.add(this.gravity); //new velocity after gravity acceleration
    this.position.add(this.velgrav); //new position after new velocity

    //Threejs only needs to generate the object once, so just updating position instead of creating new object
    if(!this.ellipse) {

      this.ellipse = sphere(this.position.x,this.position.y,10,10)
      this.ellipse.color('gray')
    } else {
    this.ellipse.position.x = this.position.x
    this.ellipse.position.y = this.position.y
    }

      c++
      if(c % 5 == 0){
      Trails.push(new Particle(createVector(this.position.x, this.position.y)));
      }
  }

  Orbiter.prototype.drawAreas = function(){

      currentPos = this.position.copy();
      if(this.VertzOfAreas.length>20){
        this.VertzOfAreas.splice(0,1)
        this.VertzOfAreas.push(currentPos);
      }
      else{
        this.VertzOfAreas.push(currentPos);
      }

      if(this.VertzOfAreas.length>20){
      fill('blue');
      beginShape(CREATE_ONCE);
      shapeThickness(1)
      vertex(orbitCenter.x,orbitCenter.y)

      for (i=0; i<this.VertzOfAreas.length; i++){
        vertex(this.VertzOfAreas[i].x,this.VertzOfAreas[i].y)
      }
      endShape(CLOSE);
      }


  }

  function launchOrbiter(){

     for (let i = Orbiters.length-1; i >= 0; i--){
       Orbiters.splice(i,1);
     }
     for (let i = Trails.length-1; i >= 0; i--){
       Trails.splice(i,1);
     }

     //Initial velocity
  Orbiters.push(new Orbiter(orbitCenter.x, orbitCenter.y - h, speedSlider.value()*cos(angleSlider.value()*Math.PI/180), speedSlider.value()*sin(angleSlider.value()*Math.PI/180)));

}

// function windowResized() {
//     // Resize necessary elements to fit new window size
//     resizeCanvas(windowWidth, windowHeight); // width and height system variables updated here
//   }
// function keyTyped(){
//  if (key === 'c'){
//     for ( i = Orbiters.length-1; i >= 0; i--){
//       Orbiters.splice(i,1);
//     }
//     for ( i = Trails.length-1; i >= 0; i--){
//       Trails.splice(i,1);
//     }
//   }
// }
