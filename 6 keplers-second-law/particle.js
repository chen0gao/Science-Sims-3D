//particles class

var Particle = function(position) {
  this.acceleration = createVector(0, 0.0);
  //this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.velocity = createVector(0,0);
  this.position = position.copy();
  // this.lifespan = 1000.0;
  this.lifespan = 2000.0;
  this.display(); //Only create the ellipse once
};

Particle.prototype.run = function() {
  this.update();
  // this.display();
};

// Method to update opacity
Particle.prototype.update = function(){
  // this.velocity.add(this.acceleration);
  // this.position.add(this.velocity);
  this.ellipse.fill.material.opacity = this.lifespan/1000;
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  // fill(80, this.lifespan);
  if(system.mode=='2D') {
  fill('black');
  } else {
  fill(150);
  }
  // Method to update position
  this.ellipse = ellipse(this.position.x, this.position.y, 2,2);
  this.ellipse.fill.material.transparent = true
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0.0) {
      return true;
  } else {
    return false;
  }
};
