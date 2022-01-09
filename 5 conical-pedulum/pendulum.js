function ConicalPendulum(origin_, length_, tension_, mass_) {
  // Fill all variables
  this.origin = origin_.copy();
  this.position = createVector();
  this.length = length_;
  this.tension = tension_;
  this.aVelocity = 0.0;
  this.aAcceleration = 0.0;
  this.ballr = mass_*3; // Arbitrary ball radius

  var gravity = 1; // Arbitrary constant

  // Tcos[theta] = mg
  var theta = Math.acos(mass_*gravity/this.tension);
  this.angle = THREE.Math.radToDeg(theta)
  this.rotateAngle = 0;

  //h = l*cos(theta)
  this.height = this.length*Math.cos(THREE.Math.degToRad(this.angle))
  //r = l*cos(theta)
  this.r = this.length*Math.sin(THREE.Math.degToRad(this.angle))

  // w= sqrt(g/(l*cos[theta]))
  this.aVelocity = sqrt(gravity/(this.length*cos(THREE.Math.degToRad(this.angle))))
  // v=r*w
  this.velocity = this.r*this.aVelocity

  // Tsin[theta] = mv^2/r
  this.centripetalForce = mass_*(this.velocity**2)/this.r

  this.gravForce = mass_ * gravity

  this.go = function() {
    this.update();
    this.display();
  }

  // Function to update position
  this.update = function() {
      this.rotateAngle += (this.aVelocity/4);  // divided by 4 to slow down the speed for better Visualization
  }

  this.display = function() {
    this.position.set(this.r*sin(this.rotateAngle), this.r*cos(this.rotateAngle), 0);
    this.position.add(this.origin); // Make sure the position is relative to the pendulum's origin

    stroke(0);
    // Draw the arm
    if(this.line) system.scene.remove(this.line)
    this.line = line(this.origin.x, this.origin.y, this.position.x, this.position.y, this.height,0);

    fill(127);
    // Draw the ball
    if(!this.ellipse) {
      this.ellipse = sphere(this.position.x, this.position.y, this.ballr, this.ballr)
      this.ellipse.color('gray')
      this.ellipse.receiveShadow = true;
      this.ellipse.castShadow = true;
    } else {
      this.ellipse.position.x = this.position.x
      this.ellipse.position.y = this.position.y
      this.ellipse.update()
    }

    if(!this.rect) {
      this.rect = rect(this.origin.x-60,this.origin.y-5,this.height,120,10,10)
    }
  }
}
