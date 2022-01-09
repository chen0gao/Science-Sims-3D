function darkMode() {

  if(system.mode == '2D') {
    toggleCamera({x:546,y:58,z:361,target:w.position})

    if(system.control) {
      system.camera.position.set( system.control.origin.x, system.control.origin.y, system.control.origin.z );
      var control = new THREE.OrbitControls( system.camera, system.renderer.domElement );
      control.target.set( system.control.target.x, system.control.target.y, system.control.target.z );
      control.enabled = true;
      control.update();
    }

  } else {
    toggleCamera({x:0,y:0,z:300})
  }

}

function waterMode() {
system.water.visible = !system.water.visible
}
