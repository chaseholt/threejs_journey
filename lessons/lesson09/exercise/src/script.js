import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
/*
    * Debug
*/
const gui = new GUI()


const debugObject = {
    color: '#ff0000',
    wireframe: false,
    wireframeLinewidth: 1
}
debugObject.subdivision = 3
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const cubeTweaks = gui.addFolder('Cube')

//Changing the parameters
cubeTweaks.add(debugObject, 'subdivision').min(1).max(10).step(1).name('Subdivision').onFinishChange(() => {
    const newGeometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision)
    mesh.geometry.dispose()
    mesh.geometry = newGeometry
}
)

cubeTweaks.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('HorizontalX')
cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01)
cubeTweaks.add(mesh.position, 'z').min(-3).max(3).step(0.01)
cubeTweaks.addColor(debugObject, 'color').onChange((value) => {
    material.color.set(value)
}
)
cubeTweaks.add(mesh.material, 'wireframe')
cubeTweaks.add(mesh.material, 'wireframeLinewidth').min(0).max(10).step(0.01)

//Adding a function to the GUI
debugObject.spin = () => {
    gsap.to(mesh.rotation, { duration: 15, y: mesh.rotation.y + Math.PI * 2 })
}
cubeTweaks.add(debugObject, 'spin')

//Tweaking the Geometry
const geometryTweaks = gui.addFolder('Geometry')
geometryTweaks.add(geometry.parameters, 'width').min(1).max(10).step(0.01)
geometryTweaks.add(geometry.parameters, 'height').min(1).max(10).step(0.01)
geometryTweaks.add(geometry.parameters, 'depth').min(1).max(10).step(0.01)
geometryTweaks.add(geometry.parameters, 'widthSegments').min(1).max(10).step(1)
geometryTweaks.add(geometry.parameters, 'heightSegments').min(1).max(10).step(1)
geometryTweaks.add(geometry.parameters, 'depthSegments').min(1).max(10).step(1)

//Tweaking the Material
const materialTweaks = gui.addFolder('Material')
materialTweaks.add(material, 'wireframe')
materialTweaks.addColor(material, 'color').onChange((value) => {
    material.color.set(value)
}
)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
