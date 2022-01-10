This tutorial remade the simulation in https://sciencesims.com/tutorials/making-things-move \
Demo of this tutorial: \
Source of this tutorial: https://github.com/chen0gao/Science-Sims-3D/blob/main/tutorial/sketch.js

In p5js, [draw()](https://p5js.org/reference/#/p5/draw) function creates a new drawing in every frame, where all old drawings in the previous frame will be erased.\
Unlike p5js, in threejs (science-3d.js use it for 3D generation), all old drawings in the previous frame will be carried over to the next frame, so we only need to create each drawing object once in the setup().
```javascript
function setup() {
  canvas = createCanvas(500, 200);
  dx = 1;
  xpos = 0;
  ypos = height/2;
  
  background(200);
  ellipse(xpos,ypos,50,50);
}

function draw() {
  xpos = xpos + dx;
  if (xpos > width)
  {
    xpos = 0;
  }
}
```

Since science-3d.js is mainly focus on 3D, so we will use sphere(x,y,radius) to replace the ellipse(x,y,w,h)
```javascript
ellipse(xpos,ypos,50,50); => sphere(xpos,ypos,25);
```

To update the position of the sphere, we first need to assign it to a variable in the setup(), then change its position in the draw(), and call the .update() function.
```javascript
function draw() {
  ball.position.x = ball.position.x + dx;
  if (ball.position.x > width)
  {
    ball.position.x = 0;
  }
  ball.update();
}
```

Lastly, we can add light.\
ambientLight() is the surrounding light and its intensity is range from 0 to 1.\
pointLight(x,y) is the light that is emitted constantly from a point (like a lightbulb) 
```javascript
  //Light
  fill(color('#ffffff'))
  ambientLight = ambientLight();
  ambientLight.intensity = 0.1

  fill('white')
  pointLight(0,0);
```

Final code:
```javascript
function setup() {
  canvas = createCanvas(500, 200);
  dx = 1;
  xpos = 0;
  ypos = height/2;

  background(200);
  ball = sphere(xpos,ypos,25);

  //Light
  fill('white')
  ambientLight = ambientLight();
  ambientLight.intensity = 0.2

  fill('white')
  pointLight(0,0);
}

function draw() {
  ball.position.x = ball.position.x + dx;
  if (ball.position.x > width)
  {
    ball.position.x = 0;
  }
  ball.update();
}
```

