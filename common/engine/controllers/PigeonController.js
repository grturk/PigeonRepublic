import { Transform } from '../core.js';

export class PigeonController {
    constructor(pigeon) {
        this.pigeon = pigeon;
        this.speed = 0.1;
        this.tiltAngle = 0.1;
        this.transformComponent = this.pigeon.getComponentOfType(Transform);
        if (this.transformComponent) {
            // Store the initial translation and rotation
            this.initialTranslation = this.transformComponent.translation.slice();
            this.initialRotation = this.transformComponent.rotation.slice();
        }
    }

    update() {
        this.handleInput();
    }

    handleInput() {
        
        if(this.transformComponent) {
            //console.log("Pigeon translations:", this.pigeon.translation);
            //console.log("Pigeon rotations:", this.pigeon.rotation);           
            //console.log("Pigeon properties:", this.pigeon);

            if (keys['ArrowLeft'] ) {
                this.transformComponent.translation[0] += this.speed;
                this.transformComponent.rotation[2] = -this.tiltAngle; 
            } else if (keys['ArrowRight']) {
                this.transformComponent.translation[0] -= this.speed;
                this.transformComponent.rotation[2] = this.tiltAngle; 
            } else {
                this.transformComponent.rotation = [0, 0, 0, 1]; 
            }
      
            if (keys['ArrowUp']) {
                this.transformComponent.rotation[0] = -this.tiltAngle;
                this.storePreviousTranslation();
                this.transformComponent.translation[1] += this.speed/2;
            } else if (keys['ArrowDown']) {
                this.transformComponent.rotation[0] = this.tiltAngle*2;
                this.storePreviousTranslation();
                this.transformComponent.translation[1] -= this.speed/2;
            } else {
                this.setPreviousTranslation();
            }
        }

    }
    
    storePreviousTranslation() {
        if (!this.previousTranslation) {
            this.previousTranslation = this.transformComponent.translation.slice();
        }
    }
    
    setPreviousTranslation() {
        if (this.previousTranslation) {
            this.transformComponent.translation[1] += (this.previousTranslation[1] - this.transformComponent.translation[1]) * 0.05;
  
        }
    }
}

const keys = {};

window.addEventListener('keydown', (e) => {;
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});