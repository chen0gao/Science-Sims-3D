// water
import { Water } from 'https://threejs.org/examples/jsm/objects/Water2.js';

const textureLoader = new THREE.TextureLoader();
const waterGeometry = new THREE.PlaneGeometry( 2000, 2000 );
const flowMap = textureLoader.load('textures/water/Water_1_M_Flow.jpg' );

var water = new Water( waterGeometry, {
  scale: 2,
  textureWidth: 512,
  textureHeight: 512,
  flowMap: flowMap,
  color:0xd4f1f9,
  distortionScale: 3.7,
} );

water.rotation.x = Math.PI *  0.5;
water.position.y = 270;
system.scene.add( water );
system.water = water;
water.visible = true;
