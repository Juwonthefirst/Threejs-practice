import * as THREE from '../../modules/three.module.js';
import { OrbitControls } from '../../modules/orbit_controls.js';
import GUI from '../../modules/lil-gui.js';

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
const particleTexture = textureLoader.load('/particles/static/textures/particles/2.png')
/**
 * Points
 */
const count = 20000
const geometry = new THREE.BufferGeometry()
const position = new Float32Array(count * 3)
const color = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
    position[i] = (Math.random() - 0.5) * 10
	color[i] = Math.random()
}
geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
    	size: 0.1,
    	sizeAttenuation: true,
    	alphaMap: particleTexture,
    	transparent: true,
    	//depthTest: false,
    	//alphaTest: false,
    	depthWrite: false,
    })
)
points.material.vertexColors = true
points.material.blending = THREE.AdditiveBlending
scene.add(points)

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
camera.position.z = 3
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
	for (let i = 0; i < count; i++) {
		const i3 = i * 3
		let x = points.geometry.attributes.position.array[i3]
		points.geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
	}
	points.geometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()