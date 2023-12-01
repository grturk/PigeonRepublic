import { Transform } from '../common/engine/core.js';

export class CityController {
    constructor(city) {
        this.city = city;
        //this.camera = camera;
        this.speed = 0.1;
        this.tiltAngle = 0.1;
        this.cityTransformComponent = this.city.getComponentOfType(Transform);
        //this.cameraTransformComponent = this.camera.getComponentOfType(Transform);
    }

    update() {
        this.moveBackward();
    }
    
    moveBackward() {
        if(this.cityTransformComponent) {
            this.cityTransformComponent.translation[2] -= this.speed/2;
        }
    }

    



}
