<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let animationId: number
let renderer: any
let scene: any
let camera: any
let clock: any
let neuralGroup: any
let dataStreams: any
let coreOrb: any
let shootingStars: any[] = []
let mouseX = 0
let mouseY = 0
let isDark = true

function checkDark() {
  isDark = document.documentElement.classList.contains('dark')
}

function onMouseMove(e: MouseEvent) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
}

async function init() {
  const THREE = await import('three')
  checkDark()

  clock = new THREE.Clock()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.z = 600

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value!,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  neuralGroup = new THREE.Group()
  scene.add(neuralGroup)

  createNeuralNetwork(THREE)
  createDataStreams(THREE)
  createCoreOrb(THREE)
  createStarField(THREE)

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  const obs = new MutationObserver(checkDark)
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  animate(THREE)
}

function createNeuralNetwork(THREE: any) {
  const nodeCount = 60
  const nodePositions: number[][] = []
  const nodeGeo = new THREE.SphereGeometry(3, 12, 12)

  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * 1400
    const y = (Math.random() - 0.5) * 900
    const z = (Math.random() - 0.5) * 600 - 100
    nodePositions.push([x, y, z])

    const hue = 0.55 + Math.random() * 0.15
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(hue, 0.8, 0.6),
      transparent: true,
      opacity: 0.6,
    })
    const mesh = new THREE.Mesh(nodeGeo, mat)
    mesh.position.set(x, y, z)
    mesh.userData = {
      baseOpacity: 0.3 + Math.random() * 0.5,
      pulseSpeed: 0.5 + Math.random() * 2,
      pulsePhase: Math.random() * Math.PI * 2,
      baseScale: 0.5 + Math.random() * 1.5,
    }
    neuralGroup.add(mesh)
  }

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x4488ff,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
  })

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodePositions[i][0] - nodePositions[j][0]
      const dy = nodePositions[i][1] - nodePositions[j][1]
      const dz = nodePositions[i][2] - nodePositions[j][2]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < 250) {
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...nodePositions[i]),
          new THREE.Vector3(...nodePositions[j]),
        ])
        const line = new THREE.Line(geo, lineMat.clone())
        line.userData = { baseDist: dist }
        neuralGroup.add(line)
      }
    }
  }
}

function createDataStreams(THREE: any) {
  const streamCount = 800
  const positions = new Float32Array(streamCount * 3)
  const velocities = new Float32Array(streamCount * 3)
  const colors = new Float32Array(streamCount * 3)

  for (let i = 0; i < streamCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1600
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800 - 100
    velocities[i * 3] = (Math.random() - 0.5) * 0.5
    velocities[i * 3 + 1] = -0.3 - Math.random() * 0.7
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3

    const t = Math.random()
    if (t < 0.33) { colors[i * 3] = 0; colors[i * 3 + 1] = 0.82; colors[i * 3 + 2] = 1 }
    else if (t < 0.66) { colors[i * 3] = 0.48; colors[i * 3 + 1] = 0.23; colors[i * 3 + 2] = 0.93 }
    else { colors[i * 3] = 0.06; colors[i * 3 + 1] = 0.73; colors[i * 3 + 2] = 0.51 }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 1.8,
    transparent: true,
    opacity: 0.5,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  dataStreams = new THREE.Points(geo, mat)
  dataStreams.userData = { velocities }
  scene.add(dataStreams)
}

function createCoreOrb(THREE: any) {
  const group = new THREE.Group()

  const rings = [
    { radius: 80, color: 0x00d4ff, speed: 0.003, tilt: 0.3 },
    { radius: 110, color: 0x7c3aed, speed: -0.002, tilt: -0.5 },
    { radius: 140, color: 0x10b981, speed: 0.0015, tilt: 0.8 },
  ]

  rings.forEach((r) => {
    const curve = new THREE.EllipseCurve(0, 0, r.radius, r.radius * 0.3, 0, Math.PI * 2, false, 0)
    const pts = curve.getPoints(80)
    const geo = new THREE.BufferGeometry().setFromPoints(pts.map((p: any) => new THREE.Vector3(p.x, p.y, 0)))
    const mat = new THREE.LineBasicMaterial({
      color: r.color,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    })
    const ring = new THREE.Line(geo, mat)
    ring.rotation.x = r.tilt
    ring.userData = { speed: r.speed }
    group.add(ring)
  })

  const coreGeo = new THREE.SphereGeometry(12, 32, 32)
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.4,
  })
  const core = new THREE.Mesh(coreGeo, coreMat)
  group.add(core)

  const glowGeo = new THREE.SphereGeometry(25, 16, 16)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x4488ff,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
  })
  group.add(new THREE.Mesh(glowGeo, glowMat))

  group.position.set(0, 0, 50)
  coreOrb = group
  scene.add(group)
}

function createStarField(THREE: any) {
  const count = 1500
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000
    positions[i * 3 + 2] = -300 - Math.random() * 500
    sizes[i] = Math.random() * 1.5 + 0.3
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const mat = new THREE.PointsMaterial({
    color: 0xaaccff,
    size: 1,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  scene.add(new THREE.Points(geo, mat))
}

function animate(THREE: any) {
  animationId = requestAnimationFrame(() => animate(THREE))
  const t = clock.getElapsedTime()

  const alphaMultiplier = isDark ? 1 : 0.45

  neuralGroup.children.forEach((child: any) => {
    if (child.isMesh && child.userData.pulseSpeed) {
      const { baseOpacity, pulseSpeed, pulsePhase, baseScale } = child.userData
      const pulse = Math.sin(t * pulseSpeed + pulsePhase) * 0.5 + 0.5
      child.material.opacity = (baseOpacity * 0.4 + pulse * baseOpacity * 0.6) * alphaMultiplier
      const s = baseScale * (0.8 + pulse * 0.4)
      child.scale.setScalar(s)
    }
    if (child.isLine && child.userData.baseDist) {
      child.material.opacity = (0.04 + Math.sin(t * 0.5) * 0.03) * alphaMultiplier
    }
  })

  neuralGroup.rotation.y = Math.sin(t * 0.05) * 0.1
  neuralGroup.rotation.x = Math.cos(t * 0.03) * 0.05

  if (dataStreams) {
    const pos = dataStreams.geometry.attributes.position.array as Float32Array
    const vel = dataStreams.userData.velocities as Float32Array
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3] += vel[i * 3]
      pos[i * 3 + 1] += vel[i * 3 + 1]
      pos[i * 3 + 2] += vel[i * 3 + 2]
      if (pos[i * 3 + 1] < -500) {
        pos[i * 3] = (Math.random() - 0.5) * 1600
        pos[i * 3 + 1] = 500
        pos[i * 3 + 2] = (Math.random() - 0.5) * 800 - 100
      }
    }
    dataStreams.geometry.attributes.position.needsUpdate = true
    dataStreams.material.opacity = 0.4 * alphaMultiplier
  }

  if (coreOrb) {
    coreOrb.children.forEach((child: any) => {
      if (child.isLine && child.userData.speed) {
        child.rotation.z += child.userData.speed
      }
    })
    const coreChild = coreOrb.children[0]
    if (coreChild && coreChild.isMesh) {
      coreChild.material.opacity = (0.3 + Math.sin(t * 1.5) * 0.15) * alphaMultiplier
      coreChild.scale.setScalar(1 + Math.sin(t * 2) * 0.15)
    }
    coreOrb.rotation.y += 0.002
  }

  if (Math.random() < 0.008) {
    const star = createShootingStar(THREE)
    if (star) {
      scene.add(star)
      shootingStars.push(star)
    }
  }

  shootingStars = shootingStars.filter((s) => {
    s.userData.life -= 0.015
    if (s.userData.life <= 0) { scene.remove(s); return false }
    s.position.add(s.userData.velocity)
    s.material.opacity = s.userData.life * 0.6 * alphaMultiplier
    return true
  })

  camera.position.x += (mouseX * 40 - camera.position.x) * 0.015
  camera.position.y += (-mouseY * 40 - camera.position.y) * 0.015
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

function createShootingStar(THREE: any) {
  const geo = new THREE.BufferGeometry()
  const start = new THREE.Vector3(
    (Math.random() - 0.5) * 1200,
    300 + Math.random() * 300,
    (Math.random() - 0.5) * 400,
  )
  const end = start.clone().add(new THREE.Vector3(
    (Math.random() - 0.5) * 60,
    -40,
    0,
  ))
  geo.setFromPoints([start, end])

  const colors = [0x00d4ff, 0x7c3aed, 0x10b981, 0xf59e0b]
  const mat = new THREE.LineBasicMaterial({
    color: colors[Math.floor(Math.random() * colors.length)],
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  })

  const line = new THREE.Line(geo, mat)
  line.userData = {
    velocity: new THREE.Vector3((Math.random() - 0.5) * 4, -6 - Math.random() * 4, 0),
    life: 1,
  }
  return line
}

function onResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

onMounted(() => { init() })

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none;"
  />
</template>
