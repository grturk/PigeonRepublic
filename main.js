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

let startGame = false;
if(!startGame) {
    document.querySelector('.fullscreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';

    document.getElementById('startButton').addEventListener('click', function() {
        startGame = true;
        document.getElementById('startScreen').style.display = 'none';
        document.querySelector('.fullscreen').style.display = 'block';
    });
}

const scoringSystem = new ScoringSytem();
const gameOver = new GameOver(scoringSystem);



function showHitMessage() {
    const hitMessage = document.getElementById('hitMessage');
    if (hitMessage) {
        hitMessage.style.display = 'block';

        setTimeout(() => {
            hitMessage.style.display = 'none';
        }, 500);
    }
}

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
await townLoader1.load('common/models/mesto1_4.gltf');
const town1 = townLoader1.loadNode('cesta'); 

const bloki_levo_002_1 = townLoader1.loadNode('bloki__levo.002');
const bloki_levo_003_1 = townLoader1.loadNode('bloki__levo.003');
const bloki_levo_004_1 = townLoader1.loadNode('bloki__levo.004');
const bloki_desno_001_1 = townLoader1.loadNode('bloki_desno.001');
const bloki_desno_002_1 = townLoader1.loadNode('bloki_desno.002');
const bloki_desno_003_1 = townLoader1.loadNode('bloki_desno.003');
const bloki_desno_004_1 = townLoader1.loadNode('bloki_desno.004');
const hofer_ovira_1 = townLoader1.loadNode('hofer_ovira');
const lidl_ovira_1  = townLoader1.loadNode('lidl_ovira');
const person_1_1 = townLoader1.loadNode('Person');
person_1_1.addComponent(new LinearAnimator(person_1_1, {
    startPosition: [-0.25, -0.8, -0.5],
    endPosition: [-1, -0.8, 1],
    duration: 5,
    loop: true,
}));
const person_1_2 = townLoader1.loadNode('Person.001');
const person_1_3 = townLoader1.loadNode('Person.003');
person_1_3.addComponent(new LinearAnimator(person_1_3, {
    startPosition: [-1, -0.75, -1],
    endPosition: [1, -0.75, 1],
    duration: 5,
    loop: true,
}));
town1.isDynamic = true;
town1.aabb = {
    min: [-0.716, -0.716, -0.716],
    max: [0.716, 0.716, 0.716]
}
bloki_levo_002_1.isStatic = true;
bloki_levo_003_1.isStatic = true;
bloki_levo_004_1.isStatic = true;
bloki_desno_001_1.isStatic = true;
bloki_desno_002_1.isStatic = true;
bloki_desno_003_1.isStatic = true;
bloki_desno_004_1.isStatic = true;
hofer_ovira_1.isStatic = true;
lidl_ovira_1.isStatic = true;
person_1_1.isStatic = true;
person_1_2.isStatic = true;
person_1_3.isStatic = true;

const townLoader2 = new GLTFLoader();
await townLoader2.load('common/models/mesto2_4.gltf');
const town2 = townLoader2.loadNode('cesta'); 

const bloki_levo_002_2 = townLoader2.loadNode('bloki__levo.002');
const bloki_levo_003_2 = townLoader2.loadNode('bloki__levo.003');
const bloki_levo_004_2 = townLoader2.loadNode('bloki__levo.004');
const bloki_desno_001_2 = townLoader2.loadNode('bloki_desno.001');
const bloki_desno_002_2 = townLoader2.loadNode('bloki_desno.002');
const bloki_desno_003_2 = townLoader2.loadNode('bloki_desno.003');
const bloki_desno_004_2 = townLoader2.loadNode('bloki_desno.004');
const hofer_ovira_2 = townLoader2.loadNode('hofer_ovira');
const golob_znak_2  = townLoader2.loadNode('3golob_znak.001');
const golob_ovira = townLoader2.loadNode('golob_ovira');
const person_2_1 = townLoader2.loadNode('Person');
const person_2_2 = townLoader2.loadNode('Person.001');
person_2_2.addComponent(new LinearAnimator(person_2_2, {
    startPosition: [1, -0.5, 1],
    endPosition: [-1, -0.5, -1],
    duration: 4,
    loop: true,
}));
const person_2_3 = townLoader2.loadNode('Person.003');
person_2_3.addComponent(new LinearAnimator(person_2_3, {
    startPosition: [-0.5, -0.75, 0.5],
    endPosition: [-1.5, -0.75, -1.5],
    duration: 15,
    loop: true,
}));
town2.isDynamic = true;
town2.aabb = {
    min: [-0.716, -0.716, -0.716],
    max: [0.716, 0.716, 0.716]
}

bloki_levo_002_2.isStatic = true;
bloki_levo_003_2.isStatic = true;
bloki_levo_004_2.isStatic = true;
bloki_desno_001_2.isStatic = true;
bloki_desno_002_2.isStatic = true;
bloki_desno_003_2.isStatic = true;
bloki_desno_004_2.isStatic = true;
hofer_ovira_2.isStatic = true;
golob_znak_2.isStatic = true;
golob_ovira.isStatic = true;
person_2_1.isStatic = true;
person_2_2.isStatic = true;
person_2_3.isStatic = true;

const townLoader3 = new GLTFLoader();
await townLoader3.load('common/models/mesto3_3.gltf');
const town3 = townLoader3.loadNode('cesta'); 

const bloki_levo_002_3 = townLoader3.loadNode('bloki__levo.002');
const bloki_levo_003_3 = townLoader3.loadNode('bloki__levo.003');
const bloki_levo_004_3 = townLoader3.loadNode('bloki__levo.004');
const bloki_desno_001_3 = townLoader3.loadNode('bloki_desno.001');
const bloki_desno_002_3 = townLoader3.loadNode('bloki_desno.002');
const bloki_desno_003_3 = townLoader3.loadNode('bloki_desno.003');
const bloki_desno_004_3 = townLoader3.loadNode('bloki_desno.004');
const hofer_ovira_3 = townLoader3.loadNode('hofer_ovira');
const person_3_1 = townLoader3.loadNode('Person');
const person_3_2 = townLoader3.loadNode('Person.001');
const person_3_3 = townLoader3.loadNode('Person.003');
person_3_2.addComponent(new LinearAnimator(person_3_2, {
    startPosition: [0, -0.75, 0],
    endPosition: [0, -0.75, -1],
    duration: 8,
    loop: true,
}));
town3.isDynamic = true;
town3.aabb = {
    min: [-0.716, -0.716, -0.716],
    max: [0.716, 0.716, 0.716]
}
bloki_levo_002_3.isStatic = true;
bloki_levo_003_3.isStatic = true;
bloki_levo_004_3.isStatic = true;
bloki_desno_001_3.isStatic = true;
bloki_desno_002_3.isStatic = true;
bloki_desno_003_3.isStatic = true;
bloki_desno_004_3.isStatic = true;
hofer_ovira_3.isStatic = true;
person_3_1.isStatic = true;
person_3_2.isStatic = true;
person_3_3.isStatic = true;

const towns = [town1, town2, town3]

const pigeonController = new PigeonController(pigeon);
const infinityTown = new InfinityTown(scene, towns, gameOver);
window.addEventListener('feceDrop', handleFeceDrop);

const feceLoader = new GLTFLoader();
await feceLoader.load('common/models/drek3.gltf');
const fece = feceLoader.loadNode('Cube');
const dropper = new Dropper(scene, fece, pigeon, showHitMessage);

const collision = new CollisionDetection(scene, gameOver, scoringSystem, dropper);

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
});

function update(time, dt) {
    pigeonController.update();
    dropper.update(dt);
    if(startGame) {
        infinityTown.update(dt);
    }
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
