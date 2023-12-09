import { Transform } from '../core.js';

export class PigeonController {
    constructor(pigeon) {
        this.pigeon = pigeon;
        this.speed = 0.1;
        this.tiltAngle = 0.1;
        this.pigeonTransformComponent = this.pigeon.getComponentOfType(Transform);
    }

    update() {
        this.handleInput();
    }

    handleInput() {
        
        if(this.pigeonTransformComponent) {
            if (keys['ArrowLeft'] ) {
                this.pigeonTransformComponent.translation[0] += this.speed;
                this.pigeonTransformComponent.rotation[2] = -this.tiltAngle;
            } else if (keys['ArrowRight']) {
                this.pigeonTransformComponent.translation[0] -= this.speed;
                this.pigeonTransformComponent.rotation[2] = this.tiltAngle; 
            } else {
                this.pigeonTransformComponent.rotation = [0, 0, 0, 1]; 
            }
            if (keys['ArrowUp']) {
                this.pigeonTransformComponent.rotation[0] = -this.tiltAngle;
                this.storePreviousTranslation();
                this.pigeonTransformComponent.translation[1] += this.speed/2;
            } else if (keys['ArrowDown']) {
                this.pigeonTransformComponent.rotation[0] = this.tiltAngle*2;
                this.storePreviousTranslation();
                this.pigeonTransformComponent.translation[1] -= this.speed/2;
            } else {
                this.setPreviousTranslation();
            }
        }
        if (keys[' ']) {
            this.emitFeceDropEvent();
        }

    }
    
    storePreviousTranslation() {
        if (!this.previousTranslation) {
            this.previousTranslation = this.pigeonTransformComponent.translation.slice();
        }
    }
    
    setPreviousTranslation() {
        if (this.previousTranslation) {
            this.pigeonTransformComponent.translation[1] += (this.previousTranslation[1] - this.pigeonTransformComponent.translation[1]) * 0.05;
  
        }
    }

    emitFeceDropEvent() {
        const event = new CustomEvent('feceDrop', {
            detail: {
                position: this.pigeonTransformComponent.translation.slice(),
                initialSpeed: 10
            }
        });
        window.dispatchEvent(event);
    }
}

const keys = {};

window.addEventListener('keydown', (e) => {;
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

//za strelanje -> subscribe ob pritisku sproži
//v main controller.addEventListener
// class