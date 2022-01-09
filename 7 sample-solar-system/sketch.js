var planetScale = {
  "sun": 40,
  "moon": 1000,
  "mercury": 1000,
  "venus": 1000,
  "earth": 1000,
  "mars": 1000,
  "jupiter": 450,
  "saturn": 450,
  "uranus": 1000,
  "neptune": 1000,
  "pluto": 1000,
}

var orbitScale = {
  "moon": 30,
  "mercury": 1,
  "venus": 1,
  "earth": 1,
  "mars": 1,
  "jupiter": 1,
  "saturn": 1,
  "uranus": 1,
  "neptune": 1,
  "pluto": 1,
}

var orbitColor = [
  '#FFFFFF',
  '#FFADAD',
  '#FFD6A5',
  '#FDFFB6',
  '#CAFFBF',
  '#9BF6FF',
  '#A0C4FF',
  '#BDB2FF',
  '#FFC6FF',
  '#FFFFFC',
]

var planetMESH = []; //Store all planet object
var orbitObjList = []; //Store all planet's orbit object
var orbitInfoList = []; //Store all orbit's position info
var initLength = 0; //Add extra length to all orbits so everything becomes virtually better

function setup() {

  frameRate(40)
  canvas=createCanvas(windowWidth, windowHeight*1);

  orbitCenter = createVector(0,0)
  noStroke(); //Remove Stroke around the planets

  /*********
  Sun Model
  **********/
  //radius is 696,340 km
  var sunRadius = 0.696340*planetScale['sun']
  sun = sphere(orbitCenter.x,orbitCenter.y,sunRadius,sunRadius)
  sun.color('#e5bc29')
  sun.texture('texture/2k_sun.jpg')
  sun.rotation.x = degToRad(90) //turn model into correct position
  sun.rotation.z = degToRad(7.25) //axial tilt

  //Data is stored in planet.js
  for (let i = 0;i<planetList.length;i++) {
    let planet = planetList[i];

    /*********
    Planet Model
    **********/
    // stroke(orbitColor[i])
    //diameter unit is km, the standard unit (orbital) is km^6
    let size = planet['diameter']/2/(10**6) * planetScale[planet['name']]

    planetMESH.push(sphere(orbitCenter.x,orbitCenter.y,size,size))
    planetMESH[i].texture(planet['texture'])

    planetMESH[i].rotation.x = degToRad(90) //turn model into correct position
    planetMESH[i].rotation.z = degToRad(planet['axial_tilt']) //axial tilt


    /*********
    Planet Orbit
    **********/
    push()
    //Orbital fill
    // fill('rgba(226, 230, 231, 0.1)');
    noFill()
    stroke(orbitColor[i])

    // let offset = planet['aphelion'] - planet['semi-major']
    offset = planet['semi-major'] - planet['perihelion']

    let orbitObj = ellipse(orbitCenter.x, orbitCenter.y - (offset)*orbitScale[planet['name']],
                           planet['semi-major']*2*orbitScale[planet['name']] + initLength,
                           planet['semi-minor']*2*orbitScale[planet['name']] + initLength);

    //Orbital Inclination
    if(orbitObj.fill) { //If there is fill for orbital, inclined it as well
      rotateAboutPoint(orbitObj.fill,
        new THREE.Vector3(orbitCenter.x, orbitCenter.y, 0),
        new THREE.Vector3(1, 0, 0), degToRad(planet['orbital_inclination']))
    }

    rotateAboutPoint(orbitObj.outline,
      new THREE.Vector3(orbitCenter.x, orbitCenter.y, 0),
      new THREE.Vector3(1, 0, 0), degToRad(planet['orbital_inclination']))

      orbitObjList.push(orbitObj)
      orbitInfoList.push(
        {x:orbitCenter.x,
         y:orbitCenter.y - (offset)*orbitScale[planet['name']],
         height: planet['semi-major']*2*orbitScale[planet['name']] + initLength,
         width: planet['semi-minor']*2*orbitScale[planet['name']] + initLength}
      )

    pop()
  }


  /*********
  Saturn's rings
  **********/
  push();
  fill('rgba(226, 230, 231, 0.5)')

  let ring_size = 282000/2/(10**6) * planetScale['saturn']
  let saturn_radius = planetList[5]['diameter']/2/(10**6) * planetScale['saturn']

  saturnRing = ring(0,0,ring_size,saturn_radius)
  pop();

  rotateAboutPoint(saturnRing,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0),
    degToRad(27))

  /*********
  3D setting
  **********/
  background3D(10)
  skybox("texture/2k_stars_milky_way.jpg")

  //Controls, only in 3D
  var control = trackballControls();
  control.origin = createVector(157,446,-480)
  control.target = createVector(orbitCenter.x,orbitCenter.y, 0)
  control.noPan = true
  control.maxDistance = 20000

  darkMode() //Trigger 3D mode initially

  //Light
  push()
  fill(color('#F8FF91'))
  pointLight(orbitCenter.x,orbitCenter.y);
  pop();
}


let speedMod = 1.5; //Planet moving & rotating speed modifier


//Note: The unit for Orbital period is day,
//So Rotation Period is scaled by 24 (unit: hours)
function draw() {

  //Sun's Rotation Period
  sun.rotation.y = -frameCount/609.12*speedMod;

  /*********
  Update planet & planet's orbit position
  **********/
  for (let i = 0;i<planetMESH.length;i++) {
    let planet = planetMESH[i];

    let selfRotation = -frameCount/planetList[i]['day']*speedMod;
		planet.rotation.y = selfRotation * 1//.005;

    // sets a rotation in the CCW direction
    // Different planet has different period
    let theta=-frameCount/planetList[i]['orbital_period']*speedMod;

    //This position is relative --- without Orbital Inclination
    let pos = Vector.add(
      createVector(orbitInfoList[i].x,orbitInfoList[i].y),
      createVector(orbitInfoList[i].height/2*cos(theta),orbitInfoList[i].width/2*sin(theta)))

    //Make the position absolute
    let pos_abs = absolutePosition(pos,orbitObjList[i])

    planet.position.copy( pos_abs );

    if(planet.outlineMesh){ //Planet's stroke
      planet.outlineMesh.position.copy( pos_abs );
    }

    /*********
    Update Moon & Moon's orbit position
    **********/
    if(planetList[i]['name']=='moon') {
      if(orbitObjList[0].fill) {
        orbitObjList[0].fill.position.copy( planetMESH[3].position ); // 3 is earth
      }
      orbitObjList[0].outline.position.copy( planetMESH[3].position ); // 3 is earth

      let pos = Vector.add(
        createVector(planetMESH[3].position.x,planetMESH[3].position.y),
        createVector(orbitInfoList[i].height/2*cos(theta),orbitInfoList[i].width/2*sin(theta)))

      planet.position.x = pos.x;
      planet.position.y = pos.y;
    }

    /*********
    Update Saturn's rings' position
    **********/
    if(planetList[i]['name']=='saturn') {
      saturnRing.position.copy(planetMESH[i].position)
    }
  }

}
