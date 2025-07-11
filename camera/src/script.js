import './style.css'
import * as THREE from 'three'

//import * as THREE from '../../cdn_modules/three.js@0.174.0/three.module.js'
/**
 * Base
 */
console.log(gsap)
const touchCoordinates = {
    x: 0,
    y: 0
}

window.addEventListener('touchmove', (event) => {
    const touch = event.touches[0]
    touchCoordinates.x = touch.clientX / sizes.width - 0.5
    touchCoordinates.y = touch.clientY / sizes.height - 0.5
    console.log(touchCoordinates)
})

window.addEventListener('touchend', () => {
    console.log('touchend')
    gsap.to(touchCoordinates, { duration: 1, x: 0, y: 0 })
})

window.addEventListener('mousemove', (event) => {
    touchCoordinates.x = event.clientX / sizes.width - 0.5
    touchCoordinates.y = event.clientY / sizes.height - 0.5
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 300,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
//camera.position.x = 2
//camera.position.y = 2
camera.position.z = 5
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    /*const elapsedTime = clock.getElapsedTime()
    
    // Update objects
    mesh.rotation.y = elapsedTime;*/
    
    camera.position.x = Math.sin(touchCoordinates.x * Math.PI * 2) * 5
    camera.position.z = Math.cos(touchCoordinates.x * Math.PI * 2) * 5
    camera.position.y = Math.sin(touchCoordinates.y * Math.PI * 2) * 5
    camera.lookAt(mesh.position)
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()