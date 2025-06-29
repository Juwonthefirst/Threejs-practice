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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2
const objects = [object1, object2, object3]
scene.add(...objects)

const raycaster = new THREE.Raycaster()

const touchPosition = new THREE.Vector2()

window.addEventListener('touchmove', (event) => {
    const touch = event.touches[0]
    touchPosition.x = (touch.clientX / sizes.width) * 2 - 1
    touchPosition.y = - (touch.clientY / sizes.height) * 2 + 1
})

/*raycaster.set(rayOrigin, rayDirection)
console.log(raycaster.intersectObject(object1))
console.log(raycaster.intersectObjects([object1, object2, object3]))
*/

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
let currentIntersection
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5
    
    
    raycaster.setFromCamera(touchPosition, camera)
  
    const intersections = raycaster.intersectObjects(objects)
    objects.forEach((object) => {
        object.material.color = new THREE.Color('red')
    })
    intersections.forEach((intersection) => {
        intersection.object.material.color = new THREE.Color('blue')
    })
    
    if (intersections.length) {
        if (!currentIntersection) {
            console.log('enter')
        }
        currentIntersection = intersections[0]
    }   
    else{
        
        if(currentIntersection)console.log('leave')
        currentIntersection = null
    }
    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()