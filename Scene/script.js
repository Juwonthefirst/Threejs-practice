import * as THREE from '../cdn_modules/three.js@0.174.0/three.module.js'

const scene = new THREE.Scene()

const box = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(box, material)
scene.add(mesh)

const sizes = {
	width: 300,
	height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z = 5
scene.add(camera)

const canvas = document.querySelector('.webgl')
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
	canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

window.addEventListener('click', (event) => {
	if (event.clientX < 101) {
		camera.position.x += 1
		console.log(event.clientX)
	}
	else if (event.clientX > 200) {
		camera.position.x -= 1
	}
	else if (event.clientY < 251) {
		mesh.rotation.y -= 1
	}
	else if (event.clientY > 351) {
		mesh.rotation.y += 1
	}
})

setInterval(() => {
    mesh.rotation.x += 0.02
    renderer.render(scene, camera), 1/60 * 1000
    
})