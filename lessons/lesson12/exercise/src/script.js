import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import mannequin from '../static/models/scene-v1.glb?url';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    (font) =>
        {
            const textGeometry = new TextGeometry(
                'Social Produce',
                {
                    font: font,
                    size: 0.5,
                    depth: 0.2,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 3
                }
            ).center()
            const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
            const text = new THREE.Mesh(textGeometry, textMaterial)
            scene.add(text)
            for (let i = 0; i < 100; i++)
            {
                const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
                const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
                const donut = new THREE.Mesh(donutGeometry, donutMaterial)
                scene.add(donut)
                donut.position.x = (Math.random() - 0.5) * 10
                donut.position.y = (Math.random() - 0.5) * 10
                donut.position.z = (Math.random() - 0.5) * 10
                donut.rotation.x = Math.random() * Math.PI
                donut.rotation.y = Math.random() * Math.PI
                const scale = Math.random()
                donut.scale.set(scale, scale, scale)
                
            }
        }
)

//scene.add(cube)

/*
* GTLF Loader
*/
// const gltfLoader = new GLTFLoader()
// gltfLoader.load(
//     '/models/scene-v1.glb',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(1, 1, 1)
//         scene.add(gltf.scene)
//     }
// )
// const result = await new GLTFLoader().loadAsync(mannequin);
// scene.add(result.scene)
let mixer = null;
const loader = new GLTFLoader();
loader.load(mannequin, (gltf) => {
    const model = gltf.scene;
    // Set the metalness and roughness of the materials
    model.traverse((child) => {
        child.frustumCulled = false;
        if (child instanceof THREE.Mesh) {
            child.material.metalness = 0;
        }
    }
    );
    scene.add(model);
    //move model up a bit on the screen
    model.position.y = .3;
    //set up the animation mixer
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
});

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

const light = new THREE.AmbientLight( 0x404040 );
scene.add( light );

//adding a hemisphere light
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const intensity = 1;
const light1 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light1);

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
    
    // Update mixer
    if (mixer)
    {
        mixer.update(clock.getDelta());
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
