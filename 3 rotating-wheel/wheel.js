
var wheel = function(_x,_y,_d){
  this.x = _x; //x position
  this.y = _y; //y position
  this.z = 0; //z position
  this.r = _d/2; //radius
  this.d = _d;
  this.arrowDecorations = [];
  // this.arrows = [];
  this.rimColor = false;
  this.spokeColor = false;
  this.wheelColor = false;
  this.rimThickness = 1;
  //rotation variables
  this.rotate = false;
  this.ang = 0;
  this.ang_speed = 0;

  // //translation variables
  // this.trans_speed = 0;
  //
  // //decorations for wheel
  // this.vdecorate = false;
  // this.cdecorate = false;
  //
  // //arrow vectors to display(not implemented)
  // this.translation = false;
  // this.rotation = false;
  // this.rollingNoSlip = false;

  this.position = new THREE.Vector3( _x, _y, 0 )


  //..............................
  // Rim
  //..............................
  push();
  fill('black')
  var rimShape = new THREE.Shape();
  rimShape.absarc(this.x,this.y, this.r+this.r*0.1*this.rimThickness, 0, Math.PI * 2, false);

  var hole = new THREE.Shape();
  hole.absarc(this.x,this.y, this.r, 0, Math.PI * 2, false);

  rimShape.holes.push( hole );


  var geometry = new THREE.ShapeGeometry( rimShape );
  var material = new THREE.MeshBasicMaterial( {
    transparent: true, opacity: 1,
    color: 'black', side: THREE.DoubleSide,
  } );
  var rim = new THREE.Mesh( geometry, material );
  system.scene.add(rim)
  this.rim = rim;

  //..............................
  // Wheel Body
  //..............................
  fill('gray')
  var wheel = ellipse(this.x,this.y,this.d,this.d);
  wheel.fill.material.transparent = true;
  wheel.fill.material.opacity = 0.7
  this.wheel = wheel;
  pop();


  //..............................
  // Spokes of the wheel
  //..............................
  this.spokes = [];
  this.spokes_vector = [];
  stroke('black');

  var spokeWeight = 3
  for(var i = 0;i<12;i++){

    const geometry = new THREE.BoxGeometry( spokeWeight, this.r, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 'black'} );
    const cube = new THREE.Mesh( geometry, material );

    cube.translateY( this.r/2 );
    pivot = new THREE.Group();
    pivot.add(cube);
    pivot.position.set( this.x, this.y, 1 );


    pivot.rotation.z = Math.PI/6 * i
    pivot.angle = 0 //default angle is zero

    this.spokes.push(pivot)
    system.scene.add(pivot);
  }

  this.addDecorations = function(_decorations) {
          this.arrowDecorations.forEach((arrow, i) => {

                  let vector = new Arrow(createVector(0,1),createVector(0,1)); //placeholder

                  vector.color = color('green');
                  vector.width = 10;
                  vector.location_radial = arrow.location_radial
                  vector.arrow_length = arrow.location_radial*50;
                  vector.default_ang = arrow.rimPos
                  vector.default_pos = arrow.location_radial*this.r
                  vector.zPos = arrow.zPos
                  vector.origin = createVector(this.x+(vector.default_pos)*cos(vector.default_ang),
                                              this.y+(vector.default_pos)*sin(vector.default_ang),vector.zPos);
                  vector.target = createVector(-vector.arrow_length*sin(vector.default_ang),
                                                vector.arrow_length*cos(vector.default_ang),0);

                  vector.update()
                  this.spokes_vector.push(vector)
          });

  }

  this.draw = function() {

    //..............................
    // Update for color
    //..............................
    if(this.rimColor!=false && this.rim.material.color!=this.rimColor.color) {
        this.rim.material.color = this.rimColor.color
        this.rim.material.opacity = this.rimColor.opacity
    }

    if(this.wheelColor!=false && this.wheel.material.color!=this.wheelColor.color) {
        this.wheel.fill.material.color = this.wheelColor.color
        this.wheel.fill.material.opacity = this.wheelColor.opacity
    }

    this.spokes.forEach((spokeGroup, i) => {
      spoke = spokeGroup.children[0];
        if(this.spokeColor!=false && spoke.material.color!=this.spokeColor.color) {
            spoke.material.color = this.spokeColor.color
            spoke.material.opacity = this.spokeColor.opacity
        }
    });


    //..............................
    // Update for position
    //..............................
    this.spokes.forEach((item, i) => {
      var speed = this.ang_speed*180/Math.PI;
      item.rotation.z += speed
      item.angle += speed
    });

    this.spokes_vector.forEach((vector, i) => {
      let arrow_length = this.ang_speed*180/Math.PI*25_00 * vector.location_radial;

      vector.origin = createVector(
        this.x+(vector.default_pos)*cos((this.spokes[i].angle + vector.default_ang)),
        this.y+(vector.default_pos)*sin((this.spokes[i].angle + vector.default_ang))
        ,vector.zPos);
      vector.target = createVector(
        -arrow_length*sin((this.spokes[i].angle + vector.default_ang)),
        arrow_length*cos((this.spokes[i].angle + vector.default_ang))
        ,0); //target z is new z, so is 0, not 100
      vector.update()
    });
  }

}
