function setup() {
  createCanvas(640,480);
  background(230); //
  w = new wheel(width/2,height/2,200);
  w.rotate = true;

  w.cdecorate = false;
  w.vdecorate = false;
  w.rotation = true;
  w.translation = false;
  w.rimColor = color('rgba(0,0,0,1)');
  w.spokeColor = color('rgba(0,0,0,1)');
  w.wheelColor = color('rgba(0,0,0,.1)');


  w.arrowDecorations[0] = {type: 'velocity', location_radial: 1, rimPos: 0, zPos: 30 };
  w.arrowDecorations[1] = {type: 'velocity', location_radial: .5, rimPos: 0, zPos: 30 };
  w.arrowDecorations[2] = {type: 'velocity', location_radial: 1, rimPos: PI, zPos: 30 };
  w.arrowDecorations[3] = {type: 'velocity', location_radial: .5, rimPos: PI, zPos: 30 };
  w.arrowDecorations[4] = {type: 'velocity', location_radial: 1, rimPos: HALF_PI, zPos: 30 };
  w.arrowDecorations[5] = {type: 'velocity', location_radial: .5, rimPos: HALF_PI, zPos: 30 };
  w.arrowDecorations[6] = {type: 'velocity', location_radial: 1, rimPos: 3*HALF_PI, zPos: 30 };
  w.arrowDecorations[7] = {type: 'velocity', location_radial: .5, rimPos: 3*HALF_PI, zPos: 30 };
  w.addDecorations(w.arrowDecorations);


  // drawAxes();
  stroke('blue');
  line(width/2,0,width/2,height);
  line(0,height/2,width,height/2);

  // //get speed from slider
  // w.ang_speed = rotate_speed.value()*Math.PI/180;
  w.ang_speed = 0.017453292519943295*Math.PI/180;

  // New for 3D //
  background3D(250)

  zVector = new Arrow(createVector(width/2,height/2,0),createVector(0,0,15)); //placeholder
  zVector.color = color('red');
  zVector.width = 5;
  zVector.origin = createVector(width/2,height/2,0);
  zVector.target = createVector(0,0,150);
  zVector.update()


  //Controls, only in 3D
  var control = orbitControls()
  control.origin = createVector(546, 58, 361)
  control.target = createVector(width/2, height/2, 0)
  control.enableZoom = false;

  // Unuse the control now
  // // "on" is used for the pause and resume at the end of file
  // // that allows for stopping/starting the sketch w/o prob.
  // on = true;
  //
  //
  // //create controls for sketch
  // rotate_speed = createSlider(-5,5,1,.2);
  // rotate_speed.position(20,60)
  // rotate_speed.parent('sketch-holder')
  //
  // btn_pause = createButton('Pause');
  // btn_pause.position(20,100);
  // btn_pause.mouseClicked(ptoggle);
  // btn_pause.parent('sketch-holder');
  //
  //
  // //particles for water spin
  // /*
  // var t =
  // {
  //     name: "test",
  //     colors: ["blue",[0,255,127,127],[0,255,64,32]],
  //     lifetime: 600,
  //     angle: [330,360],
  //     x: 0.2,
  //     y: 0.1
  // };
  // of = new Fountain(null,t);
  // */
  // //TODO download correct particle lib not grafica!!!
}

function draw() {

  //draw the wheel.
  w.draw()

}
