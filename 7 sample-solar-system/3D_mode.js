function darkMode() {
  if(system.mode == '2D') {

    toggleCamera({x:467,y:-105,z:430})
    triggerControls();
    system.camera.far = 60000;
    system.camera.updateProjectionMatrix()

  } else {
    toggleCamera({x:0,y:0,z:1000})
    system.camera.far = 60000;
    system.camera.updateProjectionMatrix()
  }
}
