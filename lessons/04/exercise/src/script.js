import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = -1.5
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 1.5
group.add(cube3)

 group.position.y = 1
 group.scale.y = 2
 group.rotation.y = Math.PI / 4


// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)
// // mesh.position.z = 0.7
// // mesh.position.y = 0.3
// // mesh.position.x = 0.3

// mesh.position.set(0.7, -0.6, 1)

// //Scale
// mesh.scale.set(2, .85, .56)

// //Rotation
// // mesh.rotation.reorder('YXZ')
// // mesh.rotation.y = Math.PI * .15
// // mesh.rotation.x = Math.PI * .25

// //quaternion
// mesh.quaternion.setFromEuler(new THREE.Euler(Math.PI * .25, Math.PI * .25, 0))


//Axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)



/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.y = 1
camera.position.x = 1
//camera.lookAt(mesh.position)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
