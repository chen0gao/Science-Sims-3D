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