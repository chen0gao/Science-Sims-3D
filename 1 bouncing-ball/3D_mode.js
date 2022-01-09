
  function toggle3DMode() {
    if(system.mode == '2D') {
      ball.material = new THREE.MeshPhongMaterial({
        color: ball.material.color
      });
      ball.outlineMesh.material.side = THREE.BackSide

      toggleCamera({x:100,y:0,z:-650,target:floor.position})

    } else {
      ball.material = new THREE.MeshBasicMaterial( { color: ball.material.color} )
      ball.outlineMesh.material.side = THREE.FrontSide

      toggleCamera({x:0,y:0,z:100})
    }

  }
