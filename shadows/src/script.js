import * as THREE from '../../modules/three.module.js'
import { OrbitControls } from '../../modules/orbit_controls.js'
import GUI from '../../modules/lil-gui.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Texture
const textureLoader = new THREE.TextureLoader()
const bakedShadowTexture = textureLoader.load('/shadows/static/textures/bakedShadow.jpg')
const basicShadowTexture = textureLoader.load('/shadows/static/textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 10
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
gui.add(directionalLightCameraHelper, 'visible').name('show directionalLight helper')
scene.add(directionalLightCameraHelper)

const spotlight = new THREE.SpotLight(0xffffff, 4, 10, Math.PI * 0.3)
spotlight.castShadow = true
spotlight.position.set(0, 2, 2)
spotlight.shadow.mapSize.height = 1024
spotlight.shadow.mapSize.width = 1024
spotlight.shadow.camera.fov = 30
spotlight.shadow.camera.near = 1
spotlight.shadow.camera.far = 6



scene.add(spotlight)
scene.add(spotlight.target)

const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera)
spotlightCameraHelper.visible = false
gui.add(spotlightCameraHelper, 'visible').name('show spotlightHelper helper')
scene.add(spotlightCameraHelper)
 /**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
    	color: 0x000000,
    	transparent: true,
    	alphaMap: basicShadowTexture
    })
)
shadowPlane.rotation.x = -Math.PI * 0.5
shadowPlane.position.y = plane.position.y + 0.001
scene.add(sphere, shadowPlane, plane)

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
renderer.shadowMap.enabled = false

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
	//bouncing ball
	sphere.position.x = Math.cos(elapsedTime) * 1.5
	sphere.position.y = Math.abs(Math.sin(elapsedTime * 3) * 1.5)
	sphere.position.z = Math.sin(elapsedTime) * 1.5
	
	//update shadow
	shadowPlane.position.x = sphere.position.x
	shadowPlane.position.z = sphere.position.z
	shadowPlane.material.opacity = ((1 - sphere.position.y) * 0.5) + 0.5
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()