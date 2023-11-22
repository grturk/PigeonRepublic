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

const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize(); 

const gltfLoader = new GLTFLoader();
await gltfLoader.load('common/models/pigeon2.gltf');

const scene = gltfLoader.loadScene(gltfLoader.defaultScene);


// camera

const camera = scene.find(node => node.getComponentOfType(Camera));
camera.getComponentOfType(Camera).far=1500;
camera.getComponentOfType(Camera).near=15;


//pigeon, wings animation

const wing1 = gltfLoader.loadNode('flying.001')
wing1.addComponent(new RotateAnimator(wing1, {
    startRotation: [0, 0, 0, 1],
    endRotation: [0, 0, -0.2, 0],
    duration: 1,
    loop: true,
}));
const wing2 = gltfLoader.loadNode('flying.002')
wing1.addComponent(new RotateAnimator(wing2, {
    startRotation: [0, 0, 0, 1],
    endRotation: [0, 0, 0.2, 0],
    duration: 1,
    loop: true,
}));

const pigeon = gltfLoader.loadNode('flying');
pigeon.addComponent(new Transform({
    translation: [0, 0, 0, 1], 
    rotation: [0,0,0,1],
}));
scene.addChild(pigeon);


// target

await gltfLoader.load('./common/models/target3.gltf')
const target = gltfLoader.loadNode('Target');
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
const okolje = scenaLoader.loadScene(scenaLoader.defaultScene);
 */
await gltfLoader.load('common/models/butast_primer.gltf');
const mesto = gltfLoader.loadNode('Cube.006')
//console.log(mesto); // log the background node to see if it exists

// Add the background to the scene
if (mesto) {
    mesto.addComponent(new Transform({
        translation: [-70, -2, 20, 1],
        scale: [10, 10, 10],
        rotation: [0, 0, 0, 1]
    }));
    scene.addChild(mesto);
}



function update(time, dt) {
    pigeonController.update();
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
