import * as THREE from 'three';

import vertexShader from '/shader/vertex.glsl'
import fragmentShader from '/shader/fragment.glsl'
import atmosphereVertexShader from '/shader/atmosphereVertex.glsl'
import atmosphereFragmentShader from '/shader/atmosphereFragment.glsl'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);

// crete a sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        globeTexture: {
            value: new THREE.TextureLoader().load('/globe.jpg')
        }
    }
}))

// crete a Atmosphere
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    // side: THREE.BackSide,
    shadowSide: THREE.BackSide
}))

atmosphere.scale.set(1.2, 1.2, 1.2)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

camera.position.z = 15;

const mouse = {
    x: 0,
    y: 0
}

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.005
    renderer.render(scene, camera);
    group.rotation.y = mouse.x
};

animate();



addEventListener('mousemove', ()=>{
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = (event.clientY / innerHeight) * 2 + 1

    console.log(mouse);
})