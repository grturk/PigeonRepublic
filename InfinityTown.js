
import { Transform } from './common/engine/core.js';

export class InfinityTown {
    constructor(scene, townModels) {
        this.scene = scene;
        this.townModels = townModels;
        this.threshold = -100;
        this.speed = 30;
        this.townSize = 157;
        this.initializeTowns();
    }

    initializeTowns() {
        let offset = 0;
        for (const town of this.townModels) {
            town.getComponentOfType(Transform).translation = [0, 0, offset];
            town.getComponentOfType(Transform).scale = [10, 10, 10];
            this.scene.addChild(town);
            //console.log(`Town added at position: ${offset}`, town);   
            offset += this.townSize;
        }
    }


    update(dt) {
        for (const town of this.townModels) {
            const transform = town.getComponentOfType(Transform);
            transform.translation[2] -= dt * this.speed;
        }
    
        // Check and reposition towns
        const townsSortedByZ = [...this.townModels].sort((a, b) => a.getComponentOfType(Transform).translation[2] - b.getComponentOfType(Transform).translation[2]);
        const lastTown = townsSortedByZ[townsSortedByZ.length - 1];
        
        if (townsSortedByZ[0].getComponentOfType(Transform).translation[2] < this.threshold) {
            townsSortedByZ[0].getComponentOfType(Transform).translation[2] += lastTown.getComponentOfType(Transform).translation[2] + 1.63 * this.townSize;
        }
    }

   /*  update(dt) {
        for (const town of this.townModels) {
            const transform = town.getComponentOfType(Transform);
            transform.translation[2] -= dt * this.speed;

            // check threshold
            if (transform.translation[2] < this.threshold) {
                const maxZ = Math.max(...this.townModels.map(t => t.getComponentOfType(Transform).translation[2]));
                transform.translation[2] = maxZ + 10;
            }
        }
    } */

}