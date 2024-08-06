import * as THREE from "three";
import { Wireframe } from "three/examples/jsm/Addons.js";

//Canvas
const canvas = document.querySelector("canvas.webgl");

console.log(THREE);

//scene
const scene = new THREE.Scene();

//Object
//const squareGeometry = new THREE.Geometry();
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const mesh = new THREE.Mesh(boxGeometry, sphereMaterial);
scene.add(mesh);

//Sizes
const sizes = {
  width: 800,
  height: 600,
};

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;
camera.lookAt(mesh.position);
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
