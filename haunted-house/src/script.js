import * as THREE from '../../modules/three.module.js'
import { OrbitControls } from '../../modules/orbit_controls.js'
import GUI from '../../modules/lil-gui.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#272837', 1, 15)
scene.fog = fog
/**
 * Textures
 */


const textureLoader = new THREE.TextureLoader()
const load_texture = (url) => {
	const texture = textureLoader.load(url)
	//texture.colorSpace = THREE.SRGBColorSpace
	/*texture.minFilter = THREE.NearestFilter
	texture.magFilter = THREE.NearestFilter*/
	return texture
}

// Door textures
const doorAlphaTexture = load_texture('/haunted-house/static/textures/door/alpha.jpg')
const doorColorTexture = load_texture('/haunted-house/static/textures/door/color.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace
const doorAmbientOcculsionTexture = load_texture('/haunted-house/static/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = load_texture('/haunted-house/static/textures/door/height.jpg')
const doorMetalnessTexture = load_texture('/haunted-house/static/textures/door/metalness.jpg')
const doorRoughnessTexture = load_texture('/haunted-house/static/textures/door/roughness.jpg')
const doorNormalTexture = load_texture('/haunted-house/static/textures/door/normal.jpg')

// Wall textures
const wallColorTexture = load_texture('/haunted-house/static/textures/bricks/color.jpg')
wallColorTexture.colorSpace = THREE.SRGBColorSpace
const wallNormalTexture = load_texture('/haunted-house/static/textures/bricks/normal.jpg')
const wallRoughnessTexture = load_texture('/haunted-house/static/textures/bricks/roughness.jpg')
const wallAmbientOcculsionTexture = load_texture('/haunted-house/static/textures/bricks/ambientOcclusion.jpg')

// Grass textures
const grassColorTexture = load_texture('/haunted-house/static/textures/grass/color.jpg')
grassColorTexture.colorSpace = THREE.SRGBColorSpace
const grassNormalTexture = load_texture('/haunted-house/static/textures/grass/normal.jpg')
const grassRoughnessTexture = load_texture('/haunted-house/static/textures/grass/roughness.jpg')
const grassAmbientOcculsionTexture = load_texture('/haunted-house/static/textures/grass/ambientOcclusion.jpg')

grassColorTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)
grassAmbientOcculsionTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcculsionTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcculsionTexture.wrapT = THREE.RepeatWrapping

/* House
 */
const house = new THREE.Group()
scene.add(house)

//Walls
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial({
		map: wallColorTexture,
		aoMap: wallAmbientOcculsionTexture,
		normalMap: wallNormalTexture,
		roughnessMap: wallRoughnessTexture
	})
)

walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 2.5 / 2
house.add(walls)

//Roof
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1, 4),
	new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI * 0.25
house.add(roof)

//Door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		transparent: true,
		map: doorColorTexture,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcculsionTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.15,
		metalnessMap: doorMetalnessTexture,
		roughnessMap: doorRoughnessTexture,
		normalMap: doorNormalTexture
	})
)

door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

//Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
	color: '#89c854'
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(0.8, 0.2, 2.2)
bush1.scale.set(0.5, 0.5, 0.5)
house.add(bush1)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(1.4, 0.1, 2.1)
bush2.scale.set(0.25, 0.25, 0.25)
house.add(bush2)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.scale.set(0.4, 0.4, 0.4)
house.add(bush3)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.position.set(-1, 0.05, 2.6)
bush4.scale.set(0.15, 0.15, 0.15)
house.add(bush4)

//Tombstones
const tombstones = new THREE.Group()
scene.add(tombstones)
const tombstoneGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const tombstoneMaterial = new THREE.MeshStandardMaterial({ color: 'grey' })

for (let i = 0; i < 50; i++) {
	const angle = Math.random() * Math.PI * 2
	const radius = 4 + (Math.random() * 6)
	const x = Math.cos(angle) * radius
	const z = Math.sin(angle) * radius
	
	
	const tombstone = new THREE.Mesh(tombstoneGeometry, tombstoneMaterial)
	tombstones.add(tombstone)
	tombstone.castShadow = true
	tombstone.position.set(x, 0.3, z)
	tombstone.rotation.y = (Math.random() - 0.5) * 0.4
	tombstone.rotation.z = (Math.random() - 0.5) * 0.4
	
}

//Ghosts
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0xffff00, 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight(0x00ffff, 2, 3)
scene.add(ghost3)

// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		map: grassColorTexture,
		aoMap: grassAmbientOcculsionTexture,
		normalMap: grassNormalTexture,
		roughnessMap: grassRoughnessTexture
	})
)

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array))
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.15)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.15)
moonLight.position.set(4, 5, -2)

gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)
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
camera.position.x = 4
camera.position.y = 2
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
renderer.setClearColor('#272837')

/**
 * Shadows
*/
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

roof.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true
walls.receiveShadow = true
bush1.receiveShadow = true
bush2.receiveShadow = true
bush3.receiveShadow = true
bush4.receiveShadow = true

doorLight.shadow.mapSize.height = 256
doorLight.shadow.mapSize.width = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.width = 256
ghost1.shadow.camera.far = 15

ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.width = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.width = 256
ghost3.shadow.camera.far = 7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
	const elapsedTime = clock.getElapsedTime()
	
	// Animate ghosts
	const ghost1Angle = elapsedTime * 0.5
	ghost1.position.x = Math.sin(ghost1Angle) * 4
	ghost1.position.z = Math.cos(ghost1Angle) * 4
	ghost1.position.y = Math.sin(elapsedTime * 3)
	
	const ghost2Angle = -elapsedTime * 0.32
	ghost2.position.x = Math.sin(ghost2Angle) * 5
	ghost2.position.z = Math.cos(ghost2Angle) * 5
	ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
	
	const ghost3Angle = -elapsedTime * 0.18
	ghost3.position.x = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 3.2))
	ghost3.position.z = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 1.8))
	ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
	
	// Update controls
	controls.update()
	
	// Render
	renderer.render(scene, camera)
	
	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()