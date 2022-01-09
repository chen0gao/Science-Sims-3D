function Pendulum(origin_, r_, start_) {
  // Fill all variables
  this.origin = origin_.copy();
  this.position = createVector();
  this.r = r_;
  this.angle = start_;
  this.aVelocity = 0.0;
  this.aAcceleration = 0.0;
  this.ballr = 25.0;      // Arbitrary ball radius

  this.go = function() {
    this.update();
    this.display();
  }

  // Function to update position
  this.update = function() {
    var gravity = .1;                                               // Arbitrary constant
    this.aAcceleration = (-1 * gravity / this.r) * (this.angle);  // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
      this.aVelocity += (this.aAcceleration);                            // Increment velocity
      this.angle += (this.aVelocity);                                    // Increment angle
  }

  this.display = function() {
    this.position.set(this.r*sin(this.angle), this.r*cos(this.angle), 0);         // Polar to cartesian conversion
    this.position.add(this.origin);                                               // Make sure the position is relative to the pendulum's origin

    stroke(0);
    // strokeWeight(1);
    // Draw the arm
    if(this.line) system.scene.remove(this.line)
    this.line = line(this.origin.x, this.origin.y, this.position.x, this.position.y);
    // ellipseMode(CENTER);

    fill(127);
    // Draw the ball
    if(!this.ellipse) {
      this.ellipse = sphere(this.position.x, this.position.y, this.ballr/2, this.ballr/2)
      this.ellipse.color('gray')
      this.ellipse.receiveShadow = true;
      this.ellipse.castShadow = true;
    } else {
      this.ellipse.position.x = this.position.x
      this.ellipse.position.y = this.position.y
      this.ellipse.update()
    }

    if(!this.rect) {
      this.rect = rect(this.origin.x-60,this.origin.y-5,0,120,10,10)
    }
  }
}
