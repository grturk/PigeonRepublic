
import { Transform } from './common/engine/core.js';

export class Dropper {

    constructor(scene, fece, pigeon, showHitMessage) {
        this.scene = scene;
        this.fece = fece;
        this.pigeon = pigeon;
        this.isFeceDropped = false;
        this.currentPosition = [];
        this.verticalSpeed = 0;
        this.horizontalSpeed = 10; 
        this.gravity = 9.8; 
        this.justCollided = false;
        this.showHitMessage = showHitMessage
    }

    dropFece(position, initialSpeed) {
        this.fece.getComponentOfType(Transform).translation = position.slice();
        this.fece.getComponentOfType(Transform).translation[1] += 10;
        this.verticalSpeed = 0;
        this.currentPosition = position.slice();
        this.isFeceDropped = true;
        this.fece.justCollided = false;
        this.collision = false;
    }

    handleCollision(){
        this.isFeceDropped = false;
        this.scene.removeChild(this.fece);
        this.showHitMessage();
    }


    update(dt) {
        if (this.isFeceDropped) {
            this.scene.addChild(this.fece);
            this.fece.isDynamic = true; 
            this.fece.aabb = {
                min: [-0.25, -0.25, -0.25], 
                max: [0.25, 0.25, 0.25]   
            };
        
            this.verticalSpeed += 0.2 + this.gravity * dt;

            this.currentPosition[2] += this.horizontalSpeed * dt;
            this.currentPosition[1] -= this.verticalSpeed * dt;

            this.fece.getComponentOfType(Transform).translation = this.currentPosition;


            const threshold = -20;
            if (this.currentPosition[1] < threshold) {
                this.scene.removeChild(this.fece);
                this.isFeceDropped = false; 
            }
        }
    }

}
