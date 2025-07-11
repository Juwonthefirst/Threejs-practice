
import * as THREE from '../../modules/three.module.js'
import { OrbitControls } from '../../modules/orbit_controls.js'
import GUI from '../../modules/lil-gui.js'

/**
 * Base
 */
// Debug
const gui = new GUI()
gui.close()
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(4).step(0.01)
gui.addColor(ambientLight, 'color')
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.01)
gui.addColor(directionalLight, 'color')
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.8)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 5)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 1, 1)
rectAreaLight.position.z = 1
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78ff00, 10, 10, Math.PI * 0.1, 0.25, 1)

spotLight.position.set(0, 2, 3)
scene.add(spotLight)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

 /**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.3

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
renderer.shadowMap.enabled = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()