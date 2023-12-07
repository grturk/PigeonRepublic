import { vec3, mat4 } from '../../../lib/gl-matrix-module.js';
import { getGlobalModelMatrix } from '../../../common/engine/core/SceneUtils.js';
import { Transform } from '../../../common/engine/core.js';

export class CollisionDetection {

    constructor(scene, gameOver, scoringSystem, dropper) {
        this.scene = scene;
        this.gameOver = gameOver;
        this.scoringSystem = scoringSystem;
        this.dropper = dropper;
    }

    update(t, dt) {
        this.scene.traverse(node => {
            if (node.isDynamic) {
                this.scene.traverse(other => {
                    // Skip collisions between a node and its descendants
                    if (node !== other && other.isStatic && !this.isDescendant(node, other)) {
                        this.resolveCollision(node, other);
                    }
                });
            }
        });
    }
    isDescendant(parent, child) {
        let current = child;
        while (current.parent) {
            if (current.parent === parent) {
                return true;
            }
            current = current.parent;
        }
        return false;
    }
    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    aabbIntersection(aabb1, aabb2) {
        if (!aabb1 || !aabb2) {
            console.error('AABB is undefined:', aabb1, aabb2);
            return false;
        }
        
        return (
            this.intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0]) &&
            this.intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1]) &&
            this.intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2])
        );
    }

    getTransformedAABB(node) {
        // Transform all vertices of the AABB from local to global space.
        if (!node.aabb) {
            console.error('Node AABB is undefined', node);
            return;
        }
        const matrix = getGlobalModelMatrix(node);
        //console.log("Node AABB:", node.aabb);  // Log the AABB before destructuring
        const { min, max } = node.aabb;  // Destructuring assignment causing the error
        //console.log("Min and Max:", min, max); 
        const vertices = [
            [min[0], min[1], min[2]],
            [min[0], min[1], max[2]],
            [min[0], max[1], min[2]],
            [min[0], max[1], max[2]],
            [max[0], min[1], min[2]],
            [max[0], min[1], max[2]],
            [max[0], max[1], min[2]],
            [max[0], max[1], max[2]],
        ].map(v => vec3.transformMat4(v, v, matrix));

        // Find new min and max by component.
        const xs = vertices.map(v => v[0]);
        const ys = vertices.map(v => v[1]);
        const zs = vertices.map(v => v[2]);
        const newmin = [Math.min(...xs), Math.min(...ys), Math.min(...zs)];
        const newmax = [Math.max(...xs), Math.max(...ys), Math.max(...zs)];
        return { min: newmin, max: newmax };
    }

    resolveCollision(a, b) {
        // Get global space AABBs.
        const aBox = this.getTransformedAABB(a);
        const bBox = this.getTransformedAABB(b);

        // Check if there is collision.
        const isColliding = this.aabbIntersection(aBox, bBox);
        if (isColliding) {
            
            if ((a.name == 'Cube' && b.name == 'Person' ) ||
                (a.name == 'Cube' && b.name == 'Person.001') || 
                (a.name == 'Cube' && b.name == 'Person.003')) { // če drek zadane človeka je drugačen resolve
                
                if(a.justCollided) { // da nešteje istega collisiona večkrat - za scoring
                    return;
                }
                this.scoringSystem.hit();
                a.justCollided = true;
                console.log("Score:", this.scoringSystem.checkScore());
                this.dropper.handleCollision();
            } else {
                this.gameOver.endGame();
            }

            console.log(`Collision Resolved: ${a.name} and ${b.name}`);
            // console.log("collision");
        }
    }

}