import { ResizeSystem } from './common/engine/systems/ResizeSystem.js';
import { UpdateSystem } from './common/engine/systems/UpdateSystem.js';
import { GLTFLoader } from './common/engine/loaders/GLTFLoader.js';
import { OrbitController } from './common/engine/controllers/OrbitController.js';
import { RotateAnimator } from './common/engine/animators/RotateAnimator.js';
import { LinearAnimator } from './common/engine/animators/LinearAnimator.js';
import { PigeonController } from './common/engine/controllers/PigeonController.js';
import { CityController } from './PremikanjeMesta.js';
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

const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize(); 

const pigeonLoader = new GLTFLoader();
await pigeonLoader.load('common/models/pigeon2.gltf');
const scene = pigeonLoader.loadScene(pigeonLoader.defaultScene);

// camera
const camera = scene.find(node => node.getComponentOfType(Camera));
camera.getComponentOfType(Camera).far=1500;
camera.getComponentOfType(Camera).near=15;


//pigeon, wings animation
const wing1 = pigeonLoader.loadNode('flying.001');
wing1.addComponent(new RotateAnimator(wing1, {
    startRotation: [0, 0, 0, 1],
    endRotation: [0, 0, -0.2, 0],
    duration: 1,
    loop: true,
}));


const wing2 = pigeonLoader.loadNode('flying.002');
wing2.addComponent(new RotateAnimator(wing2, {
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
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2]
}

// target

await pigeonLoader.load('./common/models/target3.gltf');
const target = pigeonLoader.loadNode('Target');

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
const mestoLoader = new GLTFLoader();
await mestoLoader.load('common/models/butast_primer1.gltf');
const mesto = mestoLoader.loadNode('cesta');

//debugger
const bloki_levo = mestoLoader.loadNode('bloki__levo');
const bloki_desno = mestoLoader.loadNode('bloki_desno');
const hofer_ovira = mestoLoader.loadNode('hofer_ovira');
const lidl_ovira  = mestoLoader.loadNode('lidl_ovira');
const person = mestoLoader.loadNode('Person');

/* console.log(bloki_levo);
console.log(bloki_desno);
console.log(hofer_ovira);
console.log(lidl_ovira);
console.log(mesto);
console.log(person); */

bloki_levo.isStatic = true;
bloki_desno.isStatic = true;
hofer_ovira.isStatic = true;
lidl_ovira.isStatic = true;
person.isStatic = true;

mesto.addComponent(new Transform({
    translation: [160, -30, 0, 0],
    scale: [10, 10, 10],
    rotation: [0, 0, 0, 1],
}));

mesto.isDynamic = true;
scene.addChild(mesto);

mesto.aabb = {
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2]
}

const cityController = new CityController(mesto);
const pigeonController = new PigeonController(pigeon, target);
const collision = new CollisionDetection(scene);



scene.traverse(node => {
    
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }
    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    
    if (boxes.length >= 2) {
        node.aabb = mergeAxisAlignedBoundingBoxes([boxes[0]]);
    }
    // Obstacles
    if (boxes.length == 1) {
        node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
    }

    /* const models = scene.filter(node => node.getComponentOfType(Model));
    models.forEach((model) => {
    console.log(model, model.aabb);
    }); */
});


function update(time, dt) {
    
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });
    pigeonController.update();
    cityController.update();
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
