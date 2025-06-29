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
 * Points
*/
const parameters = {
	count: 100000,
	size: 0.01,
	radius: 5,
	branches: 3,
	spin: 1,
	randomness: 0.2,
	randomnessPower: 3
}

let pointsGeometry
let pointsMaterial
let points


const generateGalaxy = () => {
	if (points) {
		pointsGeometry.dispose()
		pointsMaterial.dispose()
		scene.remove(points)
	}
	
	pointsGeometry = new THREE.BufferGeometry()
	const position = new Float32Array(parameters.count * 3)
	
	for (let i = 0; i < parameters.count; i++) {
		const i3 = i * 3
		const radius = Math.random() * parameters.radius
		const spinAngle = parameters.spin * radius
		const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
		const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1: -1) 
		const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1: -1)
		const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1: -1)
		
		position[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
		position[i3 + 1] = randomY
		position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
	}
	
	pointsGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
	
	pointsMaterial = new THREE.PointsMaterial({
		size: parameters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	})
	points = new THREE.Points(pointsGeometry, pointsMaterial)
	scene.add(points)
}
generateGalaxy()
gui.add(parameters, 'count').min(100).max(10000).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(100).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(1).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(20).step(1).onFinishChange(generateGalaxy)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.x = 3
camera.position.y = 3
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
	
	points.rotation.y = elapsedTime * 0.3
	
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()