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

let pigeonController, dropper, infinityTown;
let pigeonLoader, targetLoader, townLoader1, townLoader2, townLoader3, feceLoader;
let scene, camera, renderer, collision, towns, fece;

document.addEventListener('DOMContentLoaded', async () => {
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');

    startButton.addEventListener('click', async () => {
        startScreen.style.display = 'none';
        await startGame(); // Function to initialize and start the game
    });

    async function startGame() {
        // Initialize your game here
        const canvas = document.querySelector('canvas');
        renderer = new Renderer(canvas);
        await renderer.initialize(); 

        const gameOver = new GameOver();
        const scoringSystem = new ScoringSytem();

        pigeonLoader = new GLTFLoader();
        await pigeonLoader.load('common/models/pigeon5.gltf');

        targetLoader = new GLTFLoader();
        await targetLoader.load('common/models/target3.gltf');

        townLoader1 = new GLTFLoader();
        await townLoader1.load('common/models/butast_primer_loceno.gltf');

        townLoader2 = new GLTFLoader();
        await townLoader2.load('common/models/butast_primer_loceno.gltf');

        townLoader3 = new GLTFLoader();
        await townLoader3.load('common/models/butast_primer_loceno.gltf');

        feceLoader = new GLTFLoader();
        await feceLoader.load('common/models/drek3.gltf');

        scene = await pigeonLoader.loadScene(pigeonLoader.defaultScene);
        // camera
        camera = scene.find(node => node.getComponentOfType(Camera));
        camera.getComponentOfType(Camera).far = 1500;
        camera.getComponentOfType(Camera).near = 15;

        const wing1 = pigeonLoader.loadNode('flying.001')
        wing1.addComponent(new RotateAnimator(wing1, {
            startRotation: [0, 0, 0, 1],
            endRotation: [0, 0, -0.2, 0],
            duration: 1,
            loop: true,
        }));

        const wing2 = pigeonLoader.loadNode('flying.002')
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
            min: [-0.5, -0.5, -0.5],
            max: [0.5, 0.5, 0.5]
        }

        // target

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
        //const townLoader1 = new GLTFLoader();
        //await townLoader1.load('common/models/butast_primer_loceno.gltf');
        const town1 = await townLoader1.loadNode('cesta'); 

        //const cesta_1 = townLoader1.loadNode('cesta');
        const bloki_levo_002_1 = townLoader1.loadNode('bloki__levo.002');
        const bloki_levo_003_1 = townLoader1.loadNode('bloki__levo.003');
        const bloki_levo_004_1 = townLoader1.loadNode('bloki__levo.004');
        const bloki_desno_001_1 = townLoader1.loadNode('bloki_desno.001');
        const bloki_desno_002_1 = townLoader1.loadNode('bloki_desno.002');
        const bloki_desno_003_1 = townLoader1.loadNode('bloki_desno.003');
        const bloki_desno_004_1 = townLoader1.loadNode('bloki_desno.004');
        const hofer_ovira_1 = townLoader1.loadNode('hofer_ovira');
        const lidl_ovira_1  = townLoader1.loadNode('lidl_ovira');
        const person_1 = townLoader1.loadNode('Person');
        town1.isDynamic = true;
        town1.aabb = {
            min: [-0.716, -0.716, -0.716],
            max: [0.716, 0.716, 0.716]
        }
        //cesta_1.isStatic = true;
        bloki_levo_002_1.isStatic = true;
        bloki_levo_003_1.isStatic = true;
        bloki_levo_004_1.isStatic = true;
        bloki_desno_001_1.isStatic = true;
        bloki_desno_002_1.isStatic = true;
        bloki_desno_003_1.isStatic = true;
        bloki_desno_004_1.isStatic = true;
        hofer_ovira_1.isStatic = true;
        lidl_ovira_1.isStatic = true;
        person_1.isStatic = true;
        //target_1.isStatic = true;


        //const townLoader2 = new GLTFLoader();
        //await townLoader2.load('common/models/butast_primer_loceno.gltf');
        const town2 = await townLoader2.loadNode('cesta'); 

        //const cesta_2 = townLoader2.loadNode('cesta');
        const bloki_levo_002_2 = townLoader2.loadNode('bloki__levo.002');
        const bloki_levo_003_2 = townLoader2.loadNode('bloki__levo.003');
        const bloki_levo_004_2 = townLoader2.loadNode('bloki__levo.004');
        const bloki_desno_001_2 = townLoader2.loadNode('bloki_desno.001');
        const bloki_desno_002_2 = townLoader2.loadNode('bloki_desno.002');
        const bloki_desno_003_2 = townLoader2.loadNode('bloki_desno.003');
        const bloki_desno_004_2 = townLoader2.loadNode('bloki_desno.004');
        const hofer_ovira_2 = townLoader2.loadNode('hofer_ovira');
        const lidl_ovira_2  = townLoader2.loadNode('lidl_ovira');
        const person_2 = townLoader2.loadNode('Person');
        town2.isDynamic = true;
        town2.aabb = {
            min: [-0.716, -0.716, -0.716],
            max: [0.716, 0.716, 0.716]
        }
        //cesta_2.isStatic = true;
        bloki_levo_002_2.isStatic = true;
        bloki_levo_003_2.isStatic = true;
        bloki_levo_004_2.isStatic = true;
        bloki_desno_001_2.isStatic = true;
        bloki_desno_002_2.isStatic = true;
        bloki_desno_003_2.isStatic = true;
        bloki_desno_004_2.isStatic = true;
        hofer_ovira_2.isStatic = true;
        lidl_ovira_2.isStatic = true;
        person_2.isStatic = true;
        //target_2.isStatic = true;


        //const townLoader3 = new GLTFLoader();
        //await townLoader3.load('common/models/butast_primer_loceno.gltf');
        const town3 = await townLoader3.loadNode('cesta'); 

        //const cesta_3 = townLoader3.loadNode('cesta');
        const bloki_levo_002_3 = townLoader3.loadNode('bloki__levo.002');
        const bloki_levo_003_3 = townLoader3.loadNode('bloki__levo.003');
        const bloki_levo_004_3 = townLoader3.loadNode('bloki__levo.004');
        const bloki_desno_001_3 = townLoader3.loadNode('bloki_desno.001');
        const bloki_desno_002_3 = townLoader3.loadNode('bloki_desno.002');
        const bloki_desno_003_3 = townLoader3.loadNode('bloki_desno.003');
        const bloki_desno_004_3 = townLoader3.loadNode('bloki_desno.004');
        const hofer_ovira_3 = townLoader3.loadNode('hofer_ovira');
        const lidl_ovira_3  = townLoader3.loadNode('lidl_ovira');
        const person_3 = townLoader3.loadNode('Person');
        town3.isDynamic = true;
        town3.aabb = {
            min: [-0.716, -0.716, -0.716],
            max: [0.716, 0.716, 0.716]
        }
        //cesta_3.isStatic = true;
        bloki_levo_002_3.isStatic = true;
        bloki_levo_003_3.isStatic = true;
        bloki_levo_004_3.isStatic = true;
        bloki_desno_001_3.isStatic = true;
        bloki_desno_002_3.isStatic = true;
        bloki_desno_003_3.isStatic = true;
        bloki_desno_004_3.isStatic = true;
        hofer_ovira_3.isStatic = true;
        lidl_ovira_3.isStatic = true;
        person_3.isStatic = true;
        //target_3.isStatic = true;



        towns = [town1, town2, town3];

        pigeonController = new PigeonController(pigeon, target);
        collision = new CollisionDetection(scene, gameOver, scoringSystem);
        fece = await feceLoader.loadNode('Cube');
        dropper = new Dropper(scene, fece, pigeon);
        infinityTown = new InfinityTown(scene, towns, gameOver);

        window.addEventListener('feceDrop', handleFeceDrop);

        //const feceLoader = new GLTFLoader();
        //await feceLoader.load('common/models/drek3.gltf');
        //fece = await feceLoader.loadNode('Cube');

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


        const resizeSystem = new ResizeSystem({ canvas, resize }).start();
        const updateSystem = new UpdateSystem({ update, render }).start();

        // Start your game systems
        resizeSystem.start();
        updateSystem.start();

    }
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
