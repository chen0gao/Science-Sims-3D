var system = {}

/*
This is a demo, code is not fully refactored yet.
*/

/*
p5.js function implementation
*/

//Math
var PI = Math.PI;
var HALF_PI = Math.PI/2

function cos(angle) {
  return Math.cos(angle)
}

function sin(angle) {
  return Math.sin(angle)
}

function sqrt(value) {
  return value**(1/2)
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}


//Window
function draw() {
  //Dummy
}

let framerate = false;
function frameRate(fr) {
  framerate = fr*1.5 //p5js frameRate is quite faster than d3js frameRate
}

var windowWidth = window.innerWidth
var windowHeight = window.innerHeight

var frameCount = performance.now()/18;

//Function
class VectorClass {
  constructor() {
  }
  add(vector1,vector2) {
    let vector = vector1.copy()
    vector.x += vector2.x
    vector.y += vector2.y
    vector.z += vector2.z

    return createVector(vector.x,vector.y,vector.z)
  }
  div(vector1,factor) {
    let vector = vector1.copy()
    vector.x = vector.x/factor
    vector.y = vector.y/factor
    vector.z = vector.z/factor

    return createVector(vector.x,vector.y,vector.z)
  }
  mult(vector1,factor) {
    let vector = vector1.copy()
    vector.x = vector.x * factor
    vector.y = vector.y * factor
    vector.z = vector.z * factor

    return createVector(vector.x,vector.y,vector.z)
  }
  copy(vector1) {
    vector = {}
    vector.x = vector1.x
    vector.y = vector1.y
    vector.z = vector1.z
    return createVector(vector.x,vector.y,vector.z)
  }
}
const Vector = new VectorClass()

// Style
function push() {
  for(let i = 0;i<state.length;i++) {
    system.prevState[state[i]] = system[state[i]];
  }
}

function pop() {
  for(let i = 0;i<state.length;i++) {
    system[state[i]] = system.prevState[state[i]];
  }
}
// ##To do - Make color universal
function color(color,color2,color3) {
  if(typeof color == 'string' && color.includes('rgba')) {
    var colorList = color.split(',');
    newColor1 = parseFloat(colorList[0].replace(/\D/g,''));
    newColor2 = parseFloat(colorList[1].replace(/\D/g,''));
    newColor3 = parseFloat(colorList[2].replace(/\D/g,''));
    opacity = parseFloat(colorList[3].replace(/[^0-9$.,]/g,''));

    return {color: new THREE.Color(`rgb(${newColor1}, ${newColor2}, ${newColor3})`),opacity:opacity};
  } else if(typeof color != 'string') {
    return parseInt ( color.replace("#","0x"), 16 );
  } else if(typeof color == 'string') {
    return color;
  } else {
    return new THREE.Color(`rgb(${color}, ${color2}, ${color3})`);
  }
}

function noFill() {
  system.fill = 'noFill';
}

function fill(color) {
  if(typeof color == 'string' && color.includes('rgba')) {
    var colorList = color.split(',');
    newColor1 = parseFloat(colorList[0].replace(/\D/g,''));
    newColor2 = parseFloat(colorList[1].replace(/\D/g,''));
    newColor3 = parseFloat(colorList[2].replace(/\D/g,''));
    opacity = parseFloat(colorList[3].replace(/[^0-9$.,]/g,''));

    system.fill = {color: new THREE.Color(`rgb(${newColor1}, ${newColor2}, ${newColor3})`),opacity:opacity};
  } else if(isNaN(color)) {
  system.fill = {}
  system.fill.color = color2hex(color)
  } else {
  system.fill = {}
  system.fill.color = new THREE.Color(`rgb(${color}, ${color}, ${color})`)
  }
}


function noStroke() {
  system.stroke = ''
}

function stroke(color) {

    if(isNaN(color)) {
    system.stroke = color2hex(color)
    } else {
    system.stroke = new THREE.Color(`rgb(${color}, ${color}, ${color})`)
    }
}

function line(x1,y1,x2,y2,z1,z2) {

  if(!z1) z1 = 0
  if(!z2) z2 = 0

  pos1 = new THREE.Vector3( x1, y1, z1 )
  pos2 = new THREE.Vector3( x2, y2, z2 )

  const curve = new THREE.LineCurve3( pos1, pos2 )

  const points = curve.getPoints( 50 );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );

  const material = new THREE.LineBasicMaterial( { color : system.stroke } );

  const line = new THREE.Line( geometry, material );

  line.origin = line.position

  system.scene.add(line)

  line.update = function() {
    //relative position
    this.position.x = this.position.x - this.origin.x
    this.position.y = this.position.y - this.origin.y
    this.position.z = this.position.z - this.origin.z
  }


  return line;
}


var CLOSE = 'close'
var CREATE_ONCE = 'create_once'
system.shape=[]

function beginShape(once) {
  system.shape.forEach((shape, i) => {
    if(shape.once==true)
    system.scene.remove(shape.fill)
    system.shape=system.shape.filter(e=>e!=shape)
  });

system.shape[system.shape.length] = new THREE.Path();
  if(once=='create_once') {
system.shape[system.shape.length-1].once = true;
  }
}

function shapeThickness(thickness) {
  system.shape[system.shape.length-1].thickness = thickness
}

function vertex(x,y,z) {
  if(system.shape[system.shape.length-1].currentPoint.x==0
    &&
    system.shape[system.shape.length-1].currentPoint.y==0) {
    system.shape[system.shape.length-1].moveTo(x,y);
  } else {
    system.shape[system.shape.length-1].lineTo(x,y);
  }
}

function vertexCircleHole(x,y,radius,angle_start,angle_end) {
  var hole = new THREE.Shape();
  hole.absarc(x,y,radius, angle_start, angle_end, false);
  system.shape[system.shape.length-1].hole = hole
}

function endShape(close) {
  if(close=='close') system.shape[system.shape.length-1].closePath()

  points = system.shape[system.shape.length-1].getPoints();
    const shape = new THREE.Shape( points );

  if(system.shape[system.shape.length-1].hole) {
    shape.holes.push( system.shape[system.shape.length-1].hole );
  }

  let geometry;

    if(system.shape[system.shape.length-1].thickness) {

          const extrudeSettings = {
          steps: 2,
          depth: system.shape[system.shape.length-1].thickness,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 1,
          bevelOffset: 0,
          bevelSegments: 1
              };
        geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    } else {
      geometry = new THREE.ShapeGeometry( shape );
    }


  var color = (system.fill!='noFill') ? system.fill.color : 'blue'
  var opacity = (system.fill!='noFill' && system.fill.opacity) ? system.fill.opacity : 1

    const material = new THREE.MeshBasicMaterial( {
        color: color, side: THREE.DoubleSide,transparent: true,opacity: opacity
     } );
    const fill_ellipse = new THREE.Mesh( geometry, material );
    system.shape[system.shape.length-1].fill = fill_ellipse
    system.scene.add(fill_ellipse)
}

function ellipse(aX,aY,width,height,beginAngle,endAngle,shiftX,shiftY) {

  if(!beginAngle) beginAngle = 0
  if(!endAngle) endAngle = 2*Math.PI

  const curve = new THREE.EllipseCurve(
    aX,  aY,            // ax, aY
    width/2, height/2,           // xRadius, yRadius
    beginAngle,  endAngle,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
  );

  var points;

  //Close the curve
  if(endAngle-beginAngle<2*Math.PI) {
  var path = new THREE.Path(curve.getPoints(50));
  //Start from end angle
  path.moveTo(aX, aY);
  //move to start angle
  path.lineTo(aX+width/2*cos(beginAngle), aY+height/2*sin(beginAngle));
  points = path.getPoints();
} else {
  points = curve.getPoints( 50 );
}

  let ellipse_obj = {};

  ellipse_obj.beginX = aX+width/2*cos(beginAngle)
  ellipse_obj.beginY = aY+height/2*sin(beginAngle)
  ellipse_obj.endX = aX+width/2*cos(endAngle)
  ellipse_obj.endY = aY+height/2*sin(endAngle)

  // Fill
  if(system.fill!='noFill') {
    var opacity = (system.fill!='noFill' && system.fill.opacity) ? system.fill.opacity : 1


    const shape = new THREE.Shape( points );
    const geometry = new THREE.ShapeGeometry( shape );
    const material = new THREE.MeshBasicMaterial( {
      color: system.fill.color, side: THREE.DoubleSide, transparent: true, opacity: opacity
     } );
    const fill_ellipse = new THREE.Mesh( geometry, material );
    ellipse_obj.fill = fill_ellipse;
    system.scene.add(fill_ellipse)
  }

  // Outline
  if(system.stroke!='') {
    const outline_geometry = new THREE.BufferGeometry().setFromPoints( points );
    const outline_material = new THREE.LineBasicMaterial( { color : system.stroke } );

    const outline_ellipse = new THREE.Line( outline_geometry, outline_material );
    ellipse_obj.outline = outline_ellipse;
    system.scene.add(outline_ellipse)
  }

    ellipse_obj.update = function() {

      if(this.centerized) { //absolute
        this.fill.position.set(this.position.x,this.position.y,this.position.z)
      } else { //relative to origin
        this.fill.position.x = this.position.x - this.origin.x
        this.fill.position.y = this.position.y - this.origin.y
        this.fill.position.z = this.position.z - this.origin.z
      }
      this.fill.rotation.x = this.rotation.x
      this.fill.rotation.y = this.rotation.y
      this.fill.rotation.z = this.rotation.z
      if(!this.outline) return;
      if(this.centerized) {
        this.outline.position.set(this.position.x,this.position.y,this.position.z)
      } else {
      this.outline.position.x = this.position.x - this.origin.x
      this.outline.position.y = this.position.y - this.origin.y
      this.outline.position.z = this.position.z - this.origin.z
      }
      this.outline.rotation.x = this.rotation.x
      this.outline.rotation.y = this.rotation.y
      this.outline.rotation.z = this.rotation.z
    }

    ellipse_obj.center = function() {
      this.centerized = true;
      this.fill.geometry.center()
      if(!this.outline) return;
      this.outline.geometry.center()
    }

    ellipse_obj.updateAngle = function(beginAngle,endAngle) {
      system.scene.remove(this.fill)
        system.scene.remove(this.outline)
          push()
          fill(this.fill_color)
        ellipse_obj_new = ellipse(this.x,this.y,this.width,this.height,beginAngle,endAngle);

          Object.assign(this, ellipse_obj_new)
        pop();
    }

    ellipse_obj.remove = function() {
    system.scene.remove(this.fill)
    if(!this.outline) return;
    system.scene.remove(this.outline)
    }

    ellipse_obj.origin = {x:aX,y:aY}
    ellipse_obj.rotation = {x:0,y:0,z:0}
    ellipse_obj.position = {x:0,y:0,z:0}
    ellipse_obj.width = width
    ellipse_obj.height = height
    ellipse_obj.fill_color = system.fill.color
    ellipse_obj.stroke = system.stroke
  return ellipse_obj;
}


function createCanvas(x,y,mode) {
  system.width = x;
  system.height = y;
  width = x
  height = y

  system.scene = new THREE.Scene();

  system.renderer = new THREE.WebGLRenderer();
  system.renderer.shadowMap.enabled = true;


  system.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  if(!mode) {
    system.camera = new THREE.OrthographicCamera( 0, x,0, y, 1, 1000 )
    system.camera.position.z = 100;
    system.renderer.setSize( x, y );

  } else {
    system.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
    system.camera.position.set( 10, 40, 120 );
    system.renderer.setSize( window.innerWidth, window.innerHeight );
    system.renderer.setPixelRatio( window.devicePixelRatio );
    system.renderer.shadowMap.enabled = true;

    system.renderer.gammaInput = true;
    system.renderer.gammaOutput = true;

  }

  document.body.appendChild( system.renderer.domElement );

}


function background(color) {
  system.lightMode.background = color
  if(system.mode == '2D')
  system.renderer.setClearColor( new THREE.Color( `rgb(${color}, ${color}, ${color})`), 1 );
}

function background3D(color) {
  system.darkMode.background = color
  if(system.mode == '3D')
  system.renderer.setClearColor( new THREE.Color( `rgb(${color}, ${color}, ${color})`), 1 );
}

function createVector(x,y,z) {
  if(z==undefined) z=0; //z can be optional
  if(x==undefined) x=0;
  if(y==undefined) y=0;

  let frame = 1;
  let vector = {x:x,y:y,z:z}

  vector.add = function(vector2) {
    vector.x += vector2.x/frame
    vector.y += vector2.y/frame
    vector.z += vector2.z/frame
  }

  vector.div = function(factor) {
    vector.x = vector.x/factor
    vector.y = vector.y/factor
    vector.z = vector.z/factor
  }

  vector.mult = function(factor) {
    vector.x = vector.x*factor
    vector.y = vector.y*factor
    vector.z = vector.z*factor
  }

  vector.copy = function() {
    vectorCopy = {}
    vectorCopy.x = vector.x
    vectorCopy.y = vector.y
    vectorCopy.z = vector.z
    return createVector(vectorCopy.x,vectorCopy.y,vectorCopy.z)
  }
  vector.normalize = function() {
      vectorCopy = vector.copy()
      magnitude = ( (vectorCopy.x)**2+(vectorCopy.y)**2+(vectorCopy.z^2) )**(1/2)
      //make it unit vector
      vectorCopy.x = vectorCopy.x/magnitude
      vectorCopy.y = vectorCopy.y/magnitude
      vectorCopy.z = vectorCopy.z/magnitude
        vector.x = vectorCopy.x
        vector.y = vectorCopy.y
        vector.z = vectorCopy.z
  }
  vector.set = function(x,y,z) {
    vector.x = x
    vector.y = y
    vector.z = z
  }
  return vector
}

var controls = false;


//replace draw() with animate() and implement setup()
var setupOnce = false;
function animate() {

  if(!setupOnce && typeof setup === "function") {
    setup();
    setupOnce = true;
  }

  frameCount = performance.now()/18;
  draw();

  //trackball control need to update controller constantly
    if(system.mode=='3D' && system.control.name=='trackball')
  	system.control.controller.update();

  if(system.renderer)
  system.renderer.render( system.scene, system.camera );
  if(!system.renderer) {
    requestAnimationFrame( animate );
  } else {
    if(framerate) {
      setTimeout( function() {
        requestAnimationFrame( animate );
      }, 1000 / framerate );
    } else {
      requestAnimationFrame( animate );
    }
  }
}

animate();

/*
science-sim.js function implementation
*/
var KineticMass = function(pos,vel,accel,radius,color) {
  const geometry = new THREE.SphereGeometry(radius/2,32,32);
  const material = new THREE.MeshBasicMaterial( {  color: new THREE.Color( color ),
    transparent: true,
    opacity:0.7} );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = pos.x
    sphere.position.y = pos.y
    sphere.position.z = pos.z
    system.scene.add( sphere );

    sphere.mass = radius
    sphere.size = radius
    sphere.castShadow = true;

    // Outline
    var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide,
      transparent: true,
      opacity:1 } );
      outlineMaterial.side = THREE.FrontSide
      var line = new THREE.Mesh( sphere.geometry, outlineMaterial );
      line.position.x = pos.x
      line.position.y = pos.y
      line.position.z = pos.z
      line.scale.multiplyScalar(1.13);
      sphere.outlinevectorCopyframe = line

      system.scene.add( line );

      sphere.outlineMesh = line
      sphere.vel = vel
      sphere.accel = accel
      line.vel = vel
      line.accel = accel

      sphere.trace = []
      sphere.lastTrace = new Date()

      sphere.update = function(surrounding)
      {
        sphere.previousVel = sphere.vel
        sphere.vel.add(sphere.accel);
        sphere.avgXVel = (sphere.previousVel.x+sphere.vel.x)/2;
        sphere.avgYVel = (sphere.previousVel.y+sphere.vel.y)/2;
        sphere.avgZVel = (sphere.previousVel.z+sphere.vel.z)/2;
        if(surrounding) {
          sphere.position.x = sphere.vel.x;
          sphere.position.y = sphere.vel.y;
          sphere.position.z = sphere.vel.z;
        } else {
          sphere.position.x += sphere.avgXVel;
          sphere.position.y += sphere.avgYVel;
          sphere.position.z += sphere.avgZVel;
        }
        line.position.x = sphere.position.x;
        line.position.y = sphere.position.y;
        line.position.z = sphere.position.z;

        if(sphere.tail==true) {
          sphere.trace.forEach((trace, i) => {
            trace.material.opacity = trace.material.opacity - 0.2/60
            if(trace.material.opacity<=0)
            sphere.trace.splice(i, 1);
          });

          if(new Date() - sphere.lastTrace > 100 && sphere.trace.length<100) {
            const traceGeo = new THREE.SphereGeometry(2,32,32);
            const traceMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color( sphere.tailFill ), opacity: 1, transparent: true, depthWrite: false } );

            const traceSphere = new THREE.Mesh( traceGeo, traceMaterial );
            traceSphere.position.x = sphere.position.x
            traceSphere.position.y = sphere.position.y
            traceSphere.position.z = sphere.position.z
            system.scene.add( traceSphere );
            sphere.trace.push(traceSphere)
            sphere.lastTrace = new Date()
          }
        }
      }

      sphere.display = function() {
        //Dummy
      }
      sphere.applyForce = function(force){
        f = force.copy()
        f.div(sphere.mass);
        sphere.accel = f;
      };

      sphere.wrapEdgesBounceFloor = function() {

        if (ball.position.x > width) {
          ball.position.x = 0 ;
        }
        else if (ball.position.x < 0) {
          ball.position.x = width ;
        }
        if(ball.position.y > height-ball.size/2){
          overiny = ball.position.y-height+ball.size/2;
          vatheight = Math.sqrt(Math.pow(ball.vel.y,2)-2*ball.accel.y*overiny);
          ball.position.y = height-ball.size/2;
          ball.vel.y = -1*vatheight;
        }
      }

      return sphere
    }

state = ['stroke','fill']
system.stroke = 'black'
system.fill = 'noFill';
system.prevState = {}

var Arrow = function(pos,vel) {
  let helper = {arrow:[],cylinder:[]}

  let height
  if(vel.x==0 && vel.y==0 && vel.z==0) {
    height = ((1)**2 + (1)**2 + (1)**2)**(1/2) * 15 *2 ; //15 to make vel longer
  } else if(vel.x==0 && vel.y==0) {
    height = ((1)**2 + (1)**2 + (vel.z)**2)**(1/2) * 15 *2 ; //15 to make vel longer
  } else {
    height = ((vel.x)**2 + (vel.y)**2 + (vel.z)**2)**(1/2) * 15 *2 ; //15 to make vel longer
  }


    let color = 'red'

  let posvectorCopyv = new THREE.Vector3( pos.x, pos.y, pos.z )
  let velvectorCopyv = new THREE.Vector3( vel.x, vel.y, vel.z )

  let material = new THREE.MeshBasicMaterial( {color: color} );
  let geometry = new THREE.CylinderGeometry( 2, 2, height, 32);

  let cylinder = new THREE.Mesh( geometry, material );

  var axis = new THREE.Vector3(0, 1, 0);
  cylinder.quaternion.setFromUnitVectors(axis, velvectorCopyv.clone().normalize());

  ratiovectorCopyx = Math.abs(vel.x) / ((vel.x)**2 + (vel.y)**2 + (vel.z)**2)**(1/2)
  ratiovectorCopyy = Math.abs(vel.y) / ((vel.x)**2 + (vel.y)**2 + (vel.z)**2)**(1/2)
  ratiovectorCopyz = Math.abs(vel.z) / ((vel.x)**2 + (vel.y)**2 + (vel.z)**2)**(1/2)
  cylinder.position.adjX = (vel.x - 0 !=0) ? ratiovectorCopyx*Math.sign(vel.x - 0)*height/2 : 0
  cylinder.position.adjY = (vel.y - 0 !=0) ? ratiovectorCopyy*Math.sign(vel.y - 0)*height/2 : 0
  cylinder.position.adjZ = (vel.z - 0 !=0) ? ratiovectorCopyz*Math.sign(vel.z - 0)*height/2 : 0
  cylinder.position.x = pos.x + cylinder.position.adjX;
  cylinder.position.y = pos.y + cylinder.position.adjY;
  cylinder.position.z = pos.z + cylinder.position.adjZ;

  helper.cylinder.push(cylinder)

  // Lines
  let dir = new THREE.Vector3( vel.x, vel.y, vel.z );
  dir.normalize();


  let origin = new THREE.Vector3( pos.x, pos.y, pos.z );
  let length = height + 15;
  let hex = color;

  let arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex, 15, 10 );

  arrowHelper.attach( cylinder );

  helper.origin = pos
  helper.target = vel
  arrowHelper.originVel = vel
  cylinder.originVel = vel
  cylinder.originHeight = height
  arrowHelper.vel = vel
  cylinder.vel = vel

  helper.arrow.push(arrowHelper)
  system.scene.add( helper.arrow[0] );


  helper.update = function() {

    arrowHelper.position.x = helper.origin.x
    arrowHelper.position.y = helper.origin.y
    arrowHelper.position.z = helper.origin.z

    if(helper.color && cylinder.material.color!=helper.color) {
      cylinder.material.color.setHex( color2hex(helper.color) );
      arrowHelper.setColor( new THREE.Color( helper.color ) );
    }

    if(helper.target) {
      let newDir = new THREE.Vector3( helper.target.x, helper.target.y, helper.target.z )
      let normalize = ((helper.target.x)**2 + (helper.target.y)**2 + (helper.target.z)**2)**(1/2)
      let height = normalize ;
      arrowHelper.setDirection(newDir.normalize());
      arrowHelper.setLength(height, 15, 10);
      // 15 for arrow height
      cylinder.scale.y = (height-15)/cylinder.originHeight
      cylinder.position.y =+ (height-15)/2;
    }
  }

  helper.display = function() {
    //Dummy
  }

  return helper
}

var spotLight;
/*
Helper function
*/
function color2hex(htmlColor) {
  if(!htmlColor.length) return 0xFFFFFF //If there is error

  let color ={}
  color.white = 0xFFFFFF
  color.sliver = 0xC0C0C0
  color.gray = 0x808080
  color.black = 0x000000
  color.red = 0xFF0000
  color.maroon = 0x800000
  color.yellow = 0xFFFF00
  color.olive = 0x808000
  color.lime = 0x00FF00
  color.green = 0x008000
  color.aqua = 0x00FFFF
  color.teal = 0x008080
  color.blue = 0x0000FF
  color.navy = 0x000080
  color.fuchsia = 0xFF00FF
  color.purple = 0x800080

  if(htmlColor.includes('#')) return parseInt ( htmlColor.replace("#","0x"), 16 ) //If already is Hex

  return color[htmlColor.toLowerCase()]
}

/*
3D related
*/
system.mode = '2D'
let lightOnce = false;
system.lightMode = {}
system.darkMode = {}
system.lightMode.background = 250
system.darkMode.background = 11

function pointLight(x,y,z) {
  z = (z) ? z : 0;
  var color = (system.fill!='noFill') ? system.fill.color : '0xffffff'

  var pointLight = new THREE.PointLight( color, 1 );
  pointLight.position.set(x,y,0);
  pointLight.castShadow = true;
  system.scene.add( pointLight );

  return pointLight
}

function spotLight(x,y,z) {
  z = (z) ? z : 0;

  var color = (system.fill!='noFill') ? system.fill.color : '0xffffff'
  spotLight = new THREE.SpotLight( color, 1 );
  spotLight.penumbra = 0.1;
  spotLight.decay = 0.2;

  spotLight.distance = 900;
  spotLight.position.set( x, y, z );
  spotLight.intensity = 1

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 1200;
  spotLight.shadow.focus = 1;
  spotLight.shadowCameraFov = 30;
  system.scene.add( spotLight );
  spotLight.shadow.camera.updateProjectionMatrix()
  spotLight.target.updateMatrixWorld();

  spotLight.debug = function() {
  lightHelper = new THREE.SpotLightHelper( spotLight );
  system.scene.add( lightHelper );

  shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
  system.scene.add( shadowCameraHelper );
  }

  return spotLight
}

function ambientLight() {

  var color = (system.fill!='noFill') ? system.fill.color : '0xffffff'
  const ambient = new THREE.AmbientLight( color );
  system.scene.add( ambient );

  return ambient
}

function toggleCamera(position) {

  if(system.mode == '2D') {
    system.mode = '3D'
    background3D(system.darkMode.background)
    THREE.Object3D.DefaultUp.set(0, -1, 0); //This inverse the coordinate without affecting the light system
    system.camera = new THREE.PerspectiveCamera( 45, system.width / system.height, 1, 10000 );

    system.camera.position.set( position.x, position.y, position.z );
    if(position.target)
    system.camera.lookAt(position.target);
    system.camera.updateProjectionMatrix()

    //Turn off 2D view only object
    system.toggleSideIn3D.forEach((item, i) => {
      if(item) {
        item.material.side = THREE.BackSide
      } else {
        system.toggleSideIn3D = system.toggleSideIn3D.filter(e=>e!=item)
      }
    });


  } else {
    system.mode = '2D'
    background(system.lightMode.background)
    THREE.Object3D.DefaultUp.set(0, 1, 0);
    system.camera = new THREE.OrthographicCamera( 0, system.width,0, system.height, 1, 1000 )
    system.camera.rotation.set( 0, 0, 0 );
    system.camera.position.set( position.x, position.y, position.z );

    //Turn on 2D view only object
    system.toggleSideIn3D.forEach((item, i) => {
      if(item) {
      item.material.side = THREE.FrontSide
      } else {
        system.toggleSideIn3D = system.toggleSideIn3D.filter(e=>e!=item)
      }
    });

  }

}

function createFloor(x,y,width,height) {
  //Create floor
  var color = (system.fill!='noFill') ? system.fill.color : '0xffffff'
  var floorMaterial = new THREE.MeshPhongMaterial( { color: color,opacity: 0.8, transparent: true } );

  var floorGeometry = new THREE.PlaneGeometry(width, height);
  floorMaterial.side = THREE.DoubleSide;

  floorMaterial.needsUpdate = true;
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  floor.position.x = x;
  floor.position.y = y;

  system.scene.add(floor);

  function update() {
  }

  return floor

}

system.toggleSideIn3D = []


function sphere(x,y,size,setting) {
  var sphereObjGEO = new THREE.SphereGeometry( size, 30, 30 );
  var sphereObjMAT = new THREE.MeshStandardMaterial( {
  } );

  sphereObj = new THREE.Mesh( sphereObjGEO, sphereObjMAT );
  sphereObj.position.x = x;
  sphereObj.position.y = y;
  system.scene.add( sphereObj );

  // Outline
  if(system.stroke!='') {

    const outlineMaterial = new THREE.MeshBasicMaterial( {
      color: system.stroke,
      transparent: true, opacity:1
       } );
     outlineMaterial.side = THREE.FrontSide
      var line = new THREE.Mesh( sphereObjGEO, outlineMaterial );
      line.position.x = sphereObj.position.x
      line.position.y = sphereObj.position.y
      line.position.z = sphereObj.position.z
      line.scale.multiplyScalar(1.05);
      sphereObj.outlinevectorCopyframe = line
      system.scene.add( line );
      sphereObj.outlineMesh = line
      //Is not visible in 3D
      system.toggleSideIn3D.push(line)
  }

  sphereObj.update = function() {
    if(sphereObj.outlineMesh) {
      sphereObj.outlineMesh.position.set(this.position.x,this.position.y,this.position.z)
    }
  }



  sphereObj.texture = function(image) {
    var curSphere = this;

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load( image, function ( map ) {
      map.anisotropy = 8;
      curSphere.material.map = map;
      curSphere.material.needsUpdate = true;
    } );
  }

  sphereObj.color = function(color) {
    var curSphere = this;
    var sphereObjMAT = new THREE.MeshBasicMaterial( {
      color: color,
    });
    curSphere.material = sphereObjMAT;
    curSphere.material.needsUpdate = true;
  }

  return sphereObj
}

system.control = false;
function orbitControls() {
  system.control = {name:'orbit',enableZoom:true,enablePan:false}
  return system.control
}
function trackballControls() {
  system.control = {name:'trackball'}
  return system.control
}

function triggerControls() {

      if(system.control) {
        system.camera.position.set( system.control.origin.x, system.control.origin.y, system.control.origin.z );

        if(system.control.name=='orbit') {

        var control = new THREE.OrbitControls( system.camera, system.renderer.domElement );
        control.target.set( system.control.target.x, system.control.target.y, system.control.target.z );
        control.enabled = true;
        control.update();
        system.control.controller = control
        system.control.controller.enableZoom = system.control.enableZoom
        system.control.controller.enablePan = system.control.enablePan
        } else if (system.control.name=='trackball') {


        var control = new THREE.TrackballControls( system.camera, system.renderer.domElement );

        control.rotateSpeed = 10.0;
        control.zoomSpeed = 1.2;
        control.panSpeed = 0.8;

        if(system.control.maxDistance) control.maxDistance = system.control.maxDistance
        if(system.control.noPan) control.noPan = system.control.noPan

        control.target.set( system.control.target.x, system.control.target.y, system.control.target.z );
        system.control.controller = control
        }
      }

}

function ring(x,y,outerRadius,interRadius) {

  var shape = new THREE.Shape();
  shape.absarc(x,y, outerRadius, 0, Math.PI * 2, false);

  var hole = new THREE.Shape();
  hole.absarc(x,y, interRadius, 0, Math.PI * 2, false);

  shape.holes.push( hole );

  var color = (system.fill!='noFill') ? system.fill.color : 'blue'
  var opacity = (system.fill!='noFill' && system.fill.opacity) ? system.fill.opacity : 1

  var geometry = new THREE.ShapeGeometry( shape );
  var material = new THREE.MeshPhongMaterial( {
    transparent: true, opacity: opacity,
    color: color,
    side: THREE.DoubleSide,
  } );
  ring = new THREE.Mesh( geometry, material );
  system.scene.add(ring)

  return ring
}

function skybox(image,distance) {
  if(!distance) distance = 15000

  var skyGeo = new THREE.SphereGeometry(distance, 64, 64);
  var loader  = new THREE.TextureLoader(),
  texture = loader.load( image, system.render );
	texture.matrixAutoUpdate = false;
  var material = new THREE.MeshBasicMaterial( {
				map: texture,
				side: THREE.BackSide,
  });
  var sky = new THREE.Mesh(skyGeo, material);
  system.scene.add(sky);
  return sky
}

function toggle3DMode() {

  if(system.mode == '2D') {
    toggleCamera({x:-300,y:-100,z:-200})
    triggerControls();

  } else {
    if(system.control) {
      system.control.controller.dispose();
    }
    toggleCamera({x:0,y:0,z:100})
  }

}

function degToRad(deg) {
  return THREE.Math.degToRad(deg)
}

function absolutePosition(pos,ref) {
  if(!ref.matrixWorld) ref = ref.outline

  return new THREE.Vector3(
    pos.x,
    pos.y,
    pos.z)
    .applyMatrix4( ref.matrixWorld )

}

// arc(x, y, w, h, start, stop, [mode], [detail])
function arc(x, y, w, h, start, stop) {
  const curve = new THREE.EllipseCurve(
    x,  y,            // ax, aY
    w/2, h/2,           // xRadius, yRadius
    start,  stop,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
  );

  const points = curve.getPoints( 50 );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );

  let color = (system.stroke!='') ? system.stroke : 'black'
  const material = new THREE.LineBasicMaterial( { color : color } );

  // Create the final object to add to the scene
  const ellipse = new THREE.Line( geometry, material );
  system.scene.add(ellipse)
}

// rect(x, y, w, [h], [tl], [tr], [br], [bl])
function rect(x, y, z, w, h, d) {

  let color = (system.fill!='noFill') ? system.fill.color : 'blue'

  const geometry = new THREE.BoxGeometry( w, h, d );
  const material = new THREE.MeshBasicMaterial( {color: color} );
  const cube = new THREE.Mesh( geometry, material );

  cube.position.set(x+w/2,y+h/2,z+d/2);
  system.scene.add( cube );

  //Add stroke
  var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide,
    transparent: true,
    opacity:1 } );
    outlineMaterial.side = THREE.FrontSide
    var line = new THREE.Mesh( cube.geometry, outlineMaterial );
    line.position.set(x+w/2,y+h/2,z+d/2);
    let scale = 2;
    line.scale.set((w+scale)/w,(h+scale)/h,(d+scale)/d);
    cube.outlinevectorCopyframe = line
    cube.outline = line
    system.toggleSideIn3D.push(line)

    system.scene.add( line );

    return cube
  }

// Squares a number (multiplies a number by itself)
function sq(value) {
  return value*value
}


function text(string,color,fontSize,callbackArray) {

  const loader = new THREE.FontLoader();
  loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

    const geometry = new THREE.TextGeometry( string, {
      font: font,
      size: fontSize,
      height: 1,
      curveSegments: 1,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1
    } );

    const material = new THREE.MeshBasicMaterial( {  color: color,
      transparent: true,
      opacity:1} );
      txt = new THREE.Mesh( geometry, material );

      system.scene.add(txt)

      txt.center = function() {
        txt.geometry.center();
      }

      callbackArray.push(txt)
    } );
  }
