import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/*
* Debug
*/
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/*
* Environment map
*/
const rgbeLoader = new RGBELoader()
rgbeLoader.load('textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    
    scene.background = environmentMap
    scene.environment = environmentMap
})
/*
* Textures
*/
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace


//MeshNormalMaterial
//const material = new THREE.MeshNormalMaterial()
//material.flatShading = true

//MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture3

//MeshDepthMaterial
//const material = new THREE.MeshDepthMaterial()

//MeshLambertMaterial
//const material = new THREE.MeshLambertMaterial()

//MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

//MeshToonMaterial
// const material = new THREE.MeshToonMaterial()

// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

//MeshStandardMaterial
const material = new THREE.MeshStandardMaterial()
material.metalness = .7
material.roughness = .2
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = .1
material.metalnessMap = doorMetalnessTexture
material.normalMap = doorNormalTexture

//Material
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.side = THREE.DoubleSide

// Geometry
const sphereGeometry = new THREE.SphereGeometry(.5, 16, 64)
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const torusGeometry = new THREE.TorusGeometry(.3, .2, 64, 128)

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material)
const plane = new THREE.Mesh(planeGeometry, material)
const torus = new THREE.Mesh(torusGeometry, material)

sphere.position.x = -1.5
plane.position.x = 0
torus.position.x = 1.5

gui.add(material, 'metalness').min(0).max(1).step(0.0001).name('Metalness')
gui.add(material, 'roughness').min(0).max(1).step(0.0001).name('Roughness')

/*
* Lights
*/
// const ambientLight = new THREE.AmbientLight(0xffffff, .5)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// Add to scene

scene.add(sphere, plane, torus)


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
    
    // Update objects
    sphere.rotation.y = .1 * elapsedTime
    plane.rotation.y = .1 * elapsedTime
    torus.rotation.y = .1 * elapsedTime
    
    sphere.rotation.x = .15 * elapsedTime
    plane.rotation.x = .15 * elapsedTime
    torus.rotation.x = .15 * elapsedTime
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
