The following functions have the same usage as p5js
## Structure
setup()\
draw()\
push()\
pop()

## Rendering
createCanvas(x,y,[mode])

## Environment
windowWidth\
windowHeight\
frameCount\
frameRate(fr)

## Constants
HALF_PI\
PI

## Math
cos(value)\
sin(value)\
sqrt(value)\
sq(value)

createVector(x, y, [z]);

**(---New in Science-3d.js---)**\
absolutePosition(pos,ref) 

## Shape
line(x1,y1,x2,y2,z1,z2)\
ellipse(aX,aY,width,height,beginAngle,endAngle,shiftX,shiftY) \
arc(x, y, w, h, start, stop)\
rect(x, y, z, w, h, d)

vertex(x,y,z)\
beginShape([create_once])\
endShape([CLOSE])

**(---New in Science-3d.js---)**\
shapeThickness(thickness)\
vertexCircleHole(x,y,radius,angle_start,angle_end)

createFloor(x,y,width,height)\
sphere(x,y,size,setting)\
ring(x,y,outerRadius,interRadius)

## Color
background(color)\
color()\
fill()\
noFill()\
noStroke()\
stroke()

**(---New in Science-3d.js---)**\
background3D(color)\
skybox(image)\
Typography\
text(string,color,fontSize,callbackArray)


## Science.js Functions
KineticMass(pos,vel,accel,radius,color)\
Arrow(pos,vel)\
degToRad(deg)


## New -- Light
pointLight(x,y,z)\
spotLight(x,y,z)\
ambientLight()\
darkMode()

## New -- Camera
toggleCamera(position)

orbitControls()	\
trackballControls()\
triggerControls()
