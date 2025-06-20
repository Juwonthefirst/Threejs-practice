/*import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'*/

import * as THREE from '../../modules/three.module.js'
import { OrbitControls } from '../../modules/orbit_controls.js'
import GUI from '../../modules/lil-gui.js'
import { FontLoader } from '../../modules/Fontloader.js';
import { TextGeometry } from '../../modules/TextGeometry.js';

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
const matcapTexture = textureLoader.load('/text/static/textures/matcaps/3.png')

/**
* Fonts
*/
const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
const fontLoader = new FontLoader()

fontLoader.load(
	'/text/static/textures/fonts/helvetiker_regular.typeface.json',
	(font) => {
		const textGeometry = new TextGeometry(
			'Hello World',
			{
				font,
				size: 0.5,
				height: 0.2,
				depth: 0.2,
				curveSegments: 4,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 2
			}
		);
		/*textGeometry.computeBoundingBox()
		textGeometry.translate(
			-(textGeometry.boundingBox.max.x - 0.02) * 0.5,
			-(textGeometry.boundingBox.max.y - 0.02)* 0.5,
			-(textGeometry.boundingBox.max.z - 0.03)* 0.5
		)
		console.log(textGeometry.boundingBox)*/
		textGeometry.center()
		const text = new THREE.Mesh(textGeometry, material)
		scene.add(text)
	}
)
/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

const shape = Math.random()
const randomShape = shape < 0.5? new THREE.TorusGeometry(0.3, 0.2, 20, 45) : new THREE.BoxGeometry(1, 1, 1, 16, 16)
//scene.add(cube)
console.time('donut loop')
for (let i = 0; i < 300; i++) {
	const donut = new THREE.Mesh(
		randomShape,
		material
	)
	donut.position.x = (Math.random() - 0.5) * 15
	donut.position.y = (Math.random() - 0.5) * 15
	donut.position.z = (Math.random() - 0.5) * 15
	
	donut.rotation.x = Math.random() * Math.PI
	donut.rotation.y = Math.random() * Math.PI
	
	const scale = Math.random()
	donut.scale.set(scale, scale, scale)
	scene.add(donut)
}
console.timeEnd('donut loop')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const axes = new THREE.AxesHelper(10)
//scene.add(axes)

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
camera.position.z = 5
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
const guiControls = {
	startAnimation: false
}

gui
	.add(guiControls, 'startAnimation')
	.name('start animation')
	

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
	if(guiControls.startAnimation)camera.position.z = Math.cos(elapsedTime) * 5
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()