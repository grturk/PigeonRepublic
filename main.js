import { ResizeSystem } from './common/engine/systems/ResizeSystem.js';
import { UpdateSystem } from './common/engine/systems/UpdateSystem.js';

import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';

import { OrbitController } from './common/engine/controllers/OrbitController.js';
import { RotateAnimator } from './common/engine/animators/RotateAnimator.js';
import { LinearAnimator } from './common/engine/animators/LinearAnimator.js';
import { PigeonController } from './common/engine/controllers/PigeonController.js'
import {
    Camera,
    Model,
    Mesh,
    Node,
    Transform,
} from './common/engine/core.js';

import { Renderer } from './Renderer.js';
import { Light } from './Light.js';
import { Dropper } from './Dropper.js';
import { InfinityTown } from './InfinityTown.js';

const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize(); 




const pigeonLoader = new GLTFLoader();
await pigeonLoader.load('common/models/pigeon5.gltf');

const gltfLoader = new GLTFLoader();
const scene = pigeonLoader.loadScene(pigeonLoader.defaultScene);
// camera

const camera = scene.find(node => node.getComponentOfType(Camera));
camera.getComponentOfType(Camera).far=1500;
camera.getComponentOfType(Camera).near=15;
//pigeon, wings animation

const wing1 = pigeonLoader.loadNode('flying.001')
wing1.addComponent(new RotateAnimator(wing1, {
    startRotation: [0, 0, 0, 1],
    endRotation: [0, 0, -0.2, 0],
    duration: 1,
    loop: true,
}));
const wing2 = pigeonLoader.loadNode('flying.002')
wing1.addComponent(new RotateAnimator(wing2, {
    startRotation: [0, 0, 0, 1],
    endRotation: [0, 0, 0.2, 0],
    duration: 1,
    loop: true,
}));

const pigeon = pigeonLoader.loadNode('flying');
pigeon.addComponent(new Transform({
    translation: [0, 0, 0, 1], 
    rotation: [0,0,0,1],
}));
scene.addChild(pigeon);


// target
const targetLoader = new GLTFLoader();
await targetLoader.load('common/models/target3.gltf');
const target = targetLoader.loadNode('Target');
target.addComponent(new Transform({
    translation: [0, 0, -6, 1],
}));
scene.addChild(target);

const pigeonController = new PigeonController(pigeon, target);


// light

const light = new Node();
light.addComponent(new Transform({
    translation: [10, 10, 10],
}));
light.addComponent(new Light({
    ambient: 0.3,
}));
scene.addChild(light);


// town

// Load scena_scena.gltf
/*
const scenaLoader = new GLTFLoader();
await scenaLoader.load('common/models/butast_primer.gltf');
const mesto = scenaLoader.loadScene(scenaLoader.defaultScene);

//await gltfLoader.load('common/models/butast_primer.gltf');
//const mesto = gltfLoader.loadNode('City')
//console.log(mesto); // log the background node to see if it exists

// Add the background to the scene
if (mesto) {
    mesto.addComponent(new Transform({
        translation: [0, -30, 0, 0],
        scale: [10, 10, 10],
        rotation: [0, 0, 0, 1]
    }));
    scene.addChild(mesto);
}
*/
const townLoader1 = new GLTFLoader();
await townLoader1.load('common/models/butast_primer.gltf');
const town1 = townLoader1.loadNode('City'); 
//town1.addComponent(new Transform({translation: [0, -30, 0, 0], scale: [10, 10, 10]}));

const townLoader2 = new GLTFLoader();
await townLoader2.load('common/models/butast_primer.gltf');
const town2 = townLoader2.loadNode('City'); 
//town2.addComponent(new Transform({translation: [0, -30, 10, 0], scale: [10, 10, 10]}));

const townLoader3 = new GLTFLoader();
await townLoader3.load('common/models/butast_primer.gltf');
const town3 = townLoader3.loadNode('City'); 
//town3.addComponent(new Transform({translation: [0, -30, 20, 0], scale: [10, 10, 10]}));

scene.addChild(town1);
scene.addChild(town2);
scene.addChild(town3);

const towns = [town1, town2, town3]
/*
for (let i = 0; i < 3; i++) {
    const town = townLoader.loadNode('City');
    towns.push(town);
    //scene.addChild(town);
}
*/
const infinityTown = new InfinityTown(scene, towns);

window.addEventListener('feceDrop', handleFeceDrop);

const feceLoader = new GLTFLoader();
await feceLoader.load('common/models/drek3.gltf');
const fece = feceLoader.loadNode('Cube');
const dropper = new Dropper(scene, fece, pigeon);

function handleFeceDrop(event) {
    const { position, initialSpeed } = event.detail;
    dropper.dropFece(position, initialSpeed);
}


function update(time, dt) {
    pigeonController.update();
    dropper.update(dt);
    infinityTown.update(dt);
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
