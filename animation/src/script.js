import './style.css'
import * as THREE from 'three'
import {gsap} from 'gsap'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 300,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 6
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//const clock = new THREE.Clock()
gsap.to(mesh.position, {duration: 2, x: 2})
gsap.to(mesh.position, {duration: 2, y: 2, delay: 2})
const tick = () => {
    /*const elapsedTime = clock.getElapsedTime()
    mesh.position.y = Math.sin(elapsedTime)/0.25
    mesh.position.x = Math.sin(elapsedTime/0.5)/0.5*/
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()

