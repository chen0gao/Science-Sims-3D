function darkMode() {
  if(system.mode == '2D') {

    toggleCamera({x:467,y:-105,z:430})
    triggerControls();
    system.camera.updateProjectionMatrix()

    p.ellipse.material = new THREE.MeshPhongMaterial({
      color: p.ellipse.material.color
    });
    p.ellipse.outlineMesh.material.side = THREE.BackSide

  } else {
    toggleCamera({x:0,y:0,z:100})
    system.camera.updateProjectionMatrix()

    p.ellipse.material = new THREE.MeshBasicMaterial( {
      color: 'gray'} )
      p.ellipse.outlineMesh.material.side = THREE.FrontSide
  }
}
