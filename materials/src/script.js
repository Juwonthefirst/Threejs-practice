/*import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
*/

import * as THREE from '../../modules/three.module.js';
import { OrbitControls } from '../../modules/orbit_controls.js';
import GUI from '../../modules/lil-gui.js';

const gui = new GUI()


/**
 * Base
 */
 
 /**
 * Texture loader
 */
 
 const textureLoader = new THREE.TextureLoader()
 const cubeTextureLoader = new THREE.CubeTextureLoader()
 
 const loadTexture = (url) => {
 	const texture = textureLoader.load(url)
 	texture.colorSpace = THREE.SRGBColorSpace
 	texture.minFilter = THREE.NearestFilter
 	texture.magFilter = THREE.NearestFilter
 	texture.generateMipmaps = false
 	return texture
 }
 //textures 
 const doorAlpha = loadTexture('/materials/static/textures/door/alpha.jpg')
 const doorAmbientOcclusion = loadTexture('/materials/static/textures/door/ambientOcclusion.jpg')
 const doorColor = loadTexture('/materials/static/textures/door/color.jpg')
 const doorHeight = loadTexture('/materials/static/textures/door/height.jpg')
 const doorMetalness = loadTexture('/materials/static/textures/door/metalness.jpg')
 const doorNormal = loadTexture('/materials/static/textures/door/normal.jpg')
 const doorRoughness = loadTexture('/materials/static/textures/door/roughness.jpg')
 const gradient = loadTexture('/materials/static/textures/gradients/3.jpg')
 const matcap = loadTexture('/materials/static/textures/matCaps/3.png')
 
 const environmentMap = cubeTextureLoader.load([
 	'/materials/static/textures/environmentMaps/0/px.jpg',
 	'/materials/static/textures/environmentMaps/0/nx.jpg',
 	'/materials/static/textures/environmentMaps/0/py.jpg',
 	'/materials/static/textures/environmentMaps/0/ny.jpg',
 	'/materials/static/textures/environmentMaps/0/pz.jpg',
 	'/materials/static/textures/environmentMaps/0/nz.jpg'
 ])
 
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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
/*const material = new THREE.MeshBasicMaterial({
	map: doorColor,
	alphaMap: doorAlpha,
	transparent: true,
	side: THREE.DoubleSide
})*/
//const material = new THREE.MeshNormalMaterial({flatShading: true})
//const material = new THREE.MeshMatcapMaterial({matcap: matcap})
//const material = new THREE.MeshDepthMaterial({})
//const material = new THREE.MeshLambertMaterial()
//const material =  new THREE.MeshPhongMaterial({shininess: 100, specular: new THREE.Color('red')})
//const material = new THREE.MeshToonMaterial({gradientMap: gradient})
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.2
material.metalness = 0.7
material.envMap = environmentMap
/*material.map = doorColor
material.alphaMap = doorAlpha
material.aoMap = doorAmbientOcclusion
material.displacementMap = doorHeight
material.metalnessMap = doorMetalness
material.roughnessMap = doorRoughness
material.normalMap = doorNormal
material.displacementScale = 0.08
material.transparent = true
material.alphaMap = doorAlpha
*/
scene.background = environmentMap
gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.00001)
const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 64, 64),
	material
)
sphere.position.x = -2

const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 1, 100, 100),
	material
)

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 64, 128),
	material
)

torus.position.x = 2

scene.add(sphere, plane, torus)

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array))
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array))

/***
 * LIGHTS
 */
 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 6)
pointLight.position.x = 0.12
pointLight.position.y = 0.062
pointLight.position.z = 2
//scene.add(pointLight)
const helper = new THREE.PointLightHelper(pointLight)
scene.add(helper)
gui.add(pointLight.position, 'x').min(-3).max(10)
gui.add(pointLight.position, 'y').min(-3).max(10)
gui.add(pointLight.position, 'z').min(-3).max(100)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 7
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
	//update objects 
	//plane.rotation.x = 0.15 * elapsedTime
	torus.rotation.x = 0.15  * elapsedTime
	sphere.rotation.x = 0.15 * elapsedTime
	
	//plane.rotation.y = 0.1 * elapsedTime
	torus.rotation.y = 0.1 * elapsedTime
	sphere.rotation.y = 0.1 * elapsedTime
	// Update controls
	controls.update()
	
	// Render
	renderer.render(scene, camera)
	
	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()