import * as THREE from 'three';

import vertexShader from '/shader/vertex.glsl'
import fragmentShader from '/shader/fragment.glsl'
import atmosphereVertexShader from '/shader/atmosphereVertex.glsl'
import atmosphereFragmentShader from '/shader/atmosphereFragment.glsl'

import globe from '/globe.jpg'

let targetRotationX = 0.5;
let targetRotationOnMouseDownX = 0;

let targetRotationY = 0.2;
let targetRotationOnMouseDownY = 0;

let mouseX = 0;
let mouseXOnMouseDown = 0;

let mouseY = 0;
let mouseYOnMouseDown = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let slowingFactor = 0.30;

let sphere, renderer, scene, camera

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement);

    // crete a sphere
    sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
        new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                globeTexture: {
                    value: new THREE.TextureLoader().load(globe)
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

    scene.add(sphere)

    camera.position.z = 15;

    document.addEventListener('mousedown', onDocumentMouseDown, false)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onWindowResize, false)
}

function animate() {
    requestAnimationFrame(animate);
    render()
};

init();
animate();

function onDocumentMouseDown(event) {

    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;
}

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;

    targetRotationX = (mouseX - mouseXOnMouseDown) * 0.00025;

    mouseY = event.clientY - windowHalfY;

    targetRotationY = (mouseY - mouseYOnMouseDown) * 0.00025;
}

function onDocumentMouseUp(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}


function render() {

    rotateAroundWorldAxis(sphere, new THREE.Vector3(0, 1, 0), targetRotationX);
    rotateAroundWorldAxis(sphere, new THREE.Vector3(1, 0, 0), targetRotationY);

    targetRotationY = targetRotationY * (1 - slowingFactor);
    targetRotationX = targetRotationX * (1 - slowingFactor);
    renderer.render(scene, camera);

}

function rotateAroundObjectAxis(object, axis, radians) {
    let rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotationMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);

}

function rotateAroundWorldAxis(object, axis, radians) {

    let rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    rotationMatrix.multiply(object.matrix);
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}

