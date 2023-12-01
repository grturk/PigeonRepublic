
import { Transform } from './common/engine/core.js';

export class Dropper {
    /*
    constructor(scene, fece, pigeon) {
        this.fece = fece;
        this.scene = scene;
        //this.pigeon = pigeon;
        //this.position = this.pigeon.getComponentOfType(Transform).translation;
        //this.feces = []; 
        this.currentFece = null;
    }

    async dropFece(position, initialSpeed) {
        /*
        const fece = this.fece;
        fece.addComponent(new Transform({
            translation: this.position,
        }));
        this.scene.addChild(fece);
        // Store
        this.feces.push({
            model: fece,
            speed: initialSpeed,
            position: position.slice() 
        });
        console.log(this.feces.length);
        

        console.log(position);
        if (this.currentFece) {
            this.scene.removeChild(this.currentFece.model);
        }

        const newFece = this.fece; 
        newFece.addComponent(new Transform({ translation: position }));
        const newFeceTransform = newFece.getComponentOfType(Transform);
        newFeceTransform.translation = position.slice();

        this.scene.addChild(newFece);

        this.currentFece = { model: newFece, speed: initialSpeed, position: position.slice() };

    }

    update(dt) {
        //fece=this.fece[0]
        //fece.position[1] -= this.fece.
        /*for (const fece of this.feces) {
            // Update position based on speed and deltaTime (dt)
            fece.position[1] -= fece.speed*dt; // Falling down


            // Remove (cleanup)
            const threshold = 3
            if (fece.position[1] < -threshold) {
                this.scene.removeChild(fece.model);
                this.feces = this.feces.filter(f => f !== fece);
            }
        }
        if (this.currentFece) {
            // Update position based on speed and deltaTime (dt)
            this.currentFece.position[1] -= this.currentFece.speed * dt; // Falling down
    
            // Remove (cleanup)
            const threshold = 3;
            if (this.currentFece.position[1] < -threshold) {
                this.scene.removeChild(this.currentFece.model);
                this.currentFece = null;
            }
        }
       
    }*/
    constructor(scene, fece, pigeon) {
        this.scene = scene;
        this.fece = fece;
        this.pigeon = pigeon;
        this.isFeceDropped = false;
        this.currentPosition = [];
        this.verticalSpeed = 0;
        this.horizontalSpeed = 10; 
        this.gravity = 9.8; 
    }

    dropFece(position, initialSpeed) {
        // Reset the position and speed of the fece model
        this.fece.getComponentOfType(Transform).translation = position.slice();
        this.fece.getComponentOfType(Transform).translation[1] += 10;
        this.verticalSpeed = 0;
        this.currentPosition = position.slice();
        this.isFeceDropped = true;
    }

    update(dt) {
        if (this.isFeceDropped) {
            this.scene.addChild(this.fece);

            this.verticalSpeed += 0.2 + this.gravity * dt;

            this.currentPosition[2] += this.horizontalSpeed * dt;
            this.currentPosition[1] -= this.verticalSpeed * dt;

            //this.currentPosition[1] -= this.currentSpeed * dt;
            this.fece.getComponentOfType(Transform).translation = this.currentPosition;

            const threshold = -3;
            if (this.currentPosition[1] < threshold) {
                this.scene.removeChild(this.fece);
                this.isFeceDropped = false; 
                this.vericalSpeed = 0;
            }
        }
    }
    
}
