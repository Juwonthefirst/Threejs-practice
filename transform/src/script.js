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
const group = new THREE.Group()
group.scale.y = 4
group.rotation.y = -2
scene.add(group)

const mesh1 = new THREE.Mesh(
 new THREE.BoxGeometry(1, 1, 1),
 new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
mesh1.position.x = 0
mesh1.rotation.reorder('YZX')
group.add(mesh1)

const mesh2 = new THREE.Mesh(
 new THREE.BoxGeometry(1, 1, 1),
 new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
mesh2.position.x = -2
mesh2.rotation.reorder('YZX')
group.add(mesh2)

const mesh3 = new THREE.Mesh(
 new THREE.BoxGeometry(1, 1, 1),
 new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
mesh3.position.x = 2
mesh3.rotation.reorder('YZX')
group.add(mesh3)


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
camera.position.set( 0, 0, 5 )
camera.lookAt(group.position)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)