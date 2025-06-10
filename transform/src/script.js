//import './style.css'
//import * as THREE from 'three'
import * as THREE from '../../cdn_modules/three.js@0.174.0/three.module.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.x = 2
mesh.rotation.y = 2
mesh.rotation.x = 2
scene.add(mesh)


const axis = new THREE.AxesHelper(3)
scene.add(axis)
/**
 * Sizes
 */
const sizes = {
    width: 300,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set( -1, -1, 7)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)