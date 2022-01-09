function toggle3DMode() {
  if(system.mode == '2D') {

      planet.outlineMesh.material.side = THREE.BackSide

    toggleCamera({x:157,y:446,z:-480})
    triggerControls();

  } else {
    planet.outlineMesh.material.side = THREE.FrontSide
    toggleCamera({x:0,y:0,z:100})
  }
}
