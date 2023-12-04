import { ResizeSystem } from './common/engine/systems/ResizeSystem.js';
import { UpdateSystem } from './common/engine/systems/UpdateSystem.js';
import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';
import { OrbitController } from './common/engine/controllers/OrbitController.js';
import { RotateAnimator } from './common/engine/animators/RotateAnimator.js';
import { LinearAnimator } from './common/engine/animators/LinearAnimator.js';
import { PigeonController } from './common/engine/controllers/PigeonController.js';
import {
    Camera,
    Model,
    Mesh,
    Node,
    Transform,
} from './common/engine/core.js';
import { Renderer } from './Renderer.js';
import { Light } from './Light.js';

import { calculateAxisAlignedBoundingBox, mergeAxisAlignedBoundingBoxes } from './common/engine/core/MeshUtils.js';
import { CollisionDetection } from './CollisionDetection.js';

import { Dropper } from './Dropper.js';
import { InfinityTown } from './InfinityTown.js';

import { GameOver } from './GameOver.js';
import { ScoringSytem } from './ScoringSystem.js';

const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize(); 

const gameOver = new GameOver();
const scoringSystem = new ScoringSytem();

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
    scale: [0.5, 0.5, 0.5],
    rotation: [0, 0, 0, 1],
}));
pigeon.isDynamic = true;
scene.addChild(pigeon);
pigeon.aabb = {
    min: [-0.5, -0.5, -0.5],
    max: [0.5, 0.5, 0.5]
}

// target

const targetLoader = new GLTFLoader();
await targetLoader.load('common/models/target3.gltf');
const target = targetLoader.loadNode('Target');
target.addComponent(new Transform({
    translation: [0, 0, -6, 1],
}));
scene.addChild(target);


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
const townLoader1 = new GLTFLoader();
await townLoader1.load('common/models/butast_primer1.gltf');
const town1 = townLoader1.loadNode('1cesta'); 

//const cesta_1 = townLoader1.loadNode('cesta');
const bloki_levo1_1 = townLoader1.loadNode('1bloki_levo1');
const bloki_levo2_1 = townLoader1.loadNode('1bloki_levo2');
const bloki_levo3_1 = townLoader1.loadNode('1bloki_levo3');
const bloki_desno1_1 = townLoader1.loadNode('1bloki_desno1');
const bloki_desno2_1 = townLoader1.loadNode('1bloki_desno2');
const bloki_desno3_1 = townLoader1.loadNode('1bloki_desno3');
const bloki_desno4_1 = townLoader1.loadNode('1bloki_desno4');
const golob_znak_1 = townLoader1.loadNode('1golob_znak');
const hofer_ovira_1  = townLoader1.loadNode('1hofer_ovira');
const lidl_ovira_1  = townLoader1.loadNode('1lidl_ovira');
const person_1 = townLoader1.loadNode('1Person');
town1.isDynamic = true;
town1.aabb = {
    min: [-0.716, -0.716, -0.716],
    max: [0.716, 0.716, 0.716]
}
//cesta_1.isStatic = true;
bloki_levo1_1.isStatic = true;
bloki_levo2_1.isStatic = true;
bloki_levo3_1.isStatic = true;
bloki_desno1_1.isStatic = true;
bloki_desno2_1.isStatic = true;
bloki_desno3_1.isStatic = true;
bloki_desno4_1.isStatic = true;
hofer_ovira_1.isStatic = true;
lidl_ovira_1.isStatic = true;
person_1.isStatic = true;
//target_1.isStatic = true;


const townLoader2 = new GLTFLoader();
await townLoader2.load('common/models/butast_primer2.gltf');
const town2 = townLoader2.loadNode('2cesta'); 

//const cesta_2 = townLoader2.loadNode('cesta');
const bloki_levo1_2 = townLoader2.loadNode('2bloki_levo1');
const bloki_levo2_2 = townLoader2.loadNode('2bloki_levo2');
const bloki_levo3_2 = townLoader2.loadNode('2bloki_levo3');
const bloki_levo4_2 = townLoader2.loadNode('2bloki_levo4');
const bloki_desno1_2 = townLoader2.loadNode('2bloki_desno1');
const bloki_desno2_2 = townLoader2.loadNode('2bloki_desno2');
const bloki_desno3_2 = townLoader2.loadNode('2bloki_desno3');
const hofer_ovira_2 = townLoader2.loadNode('2hofer_ovira');
const golob_ovira_2  = townLoader2.loadNode('2golob_ovira');
const person_2 = townLoader2.loadNode('2Person');
town2.isDynamic = true;
town2.aabb = {
    min: [-0.716, -0.716, -0.716],
    max: [0.716, 0.716, 0.716]
};
// cesta_2.isStatic = true;
bloki_levo1_2.isStatic = true;
bloki_levo2_2.isStatic = true;
bloki_levo3_2.isStatic = true;
bloki_levo4_2.isStatic = true;
bloki_desno1_2.isStatic = true;
bloki_desno2_2.isStatic = true;
bloki_desno3_2.isStatic = true;
hofer_ovira_2.isStatic = true;
golob_ovira_2.isStatic = true;
person_2.isStatic = true;
// target_2.isStatic = true; // Change names in the below part so they will be correct, corresponding to consts above

//target_2.isStatic = true;


const townLoader3 = new GLTFLoader();
await townLoader3.load('common/models/butast_primer3.gltf');
const town3 = townLoader3.loadNode('3cesta'); 

//const cesta_3 = townLoader3.loadNode('cesta');
const bloki_levo1_3 = townLoader3.loadNode('3bloki_levo1');
const bloki_levo2_3 = townLoader3.loadNode('3bloki_levo2');
const bloki_levo3_3 = townLoader3.loadNode('3bloki_levo3');
const bloki_levo4_3 = townLoader3.loadNode('3bloki_levo4');
const bloki_desno1_3 = townLoader3.loadNode('3bloki_desno1');
const bloki_desno2_3 = townLoader3.loadNode('3bloki_desno2');
const bloki_desno3_3 = townLoader3.loadNode('3bloki_desno3');
const hofer_ovira_3 = townLoader3.loadNode('3hofer_ovira');
const golob_znak_3  = townLoader3.loadNode('3golob_znak');
const person_3 = townLoader3.loadNode('3Person');
town3.isDynamic = true;
town3.aabb = {
    min: [-0.716, -0.716, -0.716],
    max: [0.716, 0.716, 0.716]
};
// cesta_3.isStatic = true;
bloki_levo1_3.isStatic = true;
bloki_levo2_3.isStatic = true;
bloki_levo3_3.isStatic = true;
bloki_levo4_3.isStatic = true;
bloki_desno1_3.isStatic = true;
bloki_desno2_3.isStatic = true;
bloki_desno3_3.isStatic = true;
hofer_ovira_3.isStatic = true;
golob_znak_3.isStatic = true;
person_3.isStatic = true;

//target_3.isStatic = true;



const towns = [town1, town2, town3]

const pigeonController = new PigeonController(pigeon, target);
const collision = new CollisionDetection(scene, gameOver, scoringSystem);


const infinityTown = new InfinityTown(scene, towns, gameOver);

window.addEventListener('feceDrop', handleFeceDrop);

const feceLoader = new GLTFLoader();
await feceLoader.load('common/models/drek3.gltf');
const fece = feceLoader.loadNode('Cube');
const dropper = new Dropper(scene, fece, pigeon);

function handleFeceDrop(event) {
    const { position, initialSpeed } = event.detail;
    dropper.dropFece(position, initialSpeed);
}

scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);

    // Log bounding box details with node name
    /*
    if (node.aabb) {
        console.log(`Node AABB: ${node.name || 'Unnamed Node'}`, {
            min: node.aabb.min,
            max: node.aabb.max,
            width: node.aabb.max[0] - node.aabb.min[0],
            height: node.aabb.max[1] - node.aabb.min[1],
            depth: node.aabb.max[2] - node.aabb.min[2],
        });
    } else {
        // Log individual bounding boxes if no merging is performed
        boxes.forEach((box, index) => {
            console.log(`${node.name || 'Unnamed Node'} - Bounding Box ${index + 1}:`, {
                min: box.min,
                max: box.max,
                width: box.max[0] - box.min[0],
                height: box.max[1] - box.min[1],
                depth: box.max[2] - box.min[2],
            });
        });
    }*/
});


function update(time, dt) {
    pigeonController.update();
    dropper.update(dt);
    infinityTown.update(dt);
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });

    collision.update(time, dt);
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
