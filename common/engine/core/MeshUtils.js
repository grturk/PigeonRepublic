import { quat, vec3, vec4, mat3, mat4 } from '../../../lib/gl-matrix-module.js';

export function transformVertex(vertex, matrix,
    normalMatrix = mat3.normalFromMat4(mat3.create(), matrix),
    tangentMatrix = mat3.fromMat4(mat3.create(), matrix),
) {
    vec3.transformMat4(vertex.position, vertex.position, matrix);
    vec3.transformMat3(vertex.normal, vertex.normal, normalMatrix);
    vec3.transformMat3(vertex.tangent, vertex.tangent, tangentMatrix);
}

export function transformMesh(mesh, matrix,
    normalMatrix = mat3.normalFromMat4(mat3.create(), matrix),
    tangentMatrix = mat3.fromMat4(mat3.create(), matrix),
) {
    for (const vertex of mesh.vertices) {
        transformVertex(vertex, matrix, normalMatrix, tangentMatrix);
    }
}

export function calculateAxisAlignedBoundingBox(mesh) {
    const initial = {
        min: vec3.clone(mesh.vertices[0].position),
        max: vec3.clone(mesh.vertices[0].position),
    };

    return {
        min: mesh.vertices.reduce((a, b) => vec3.min(a, a, b.position), initial.min),
        max: mesh.vertices.reduce((a, b) => vec3.max(a, a, b.position), initial.max),
    };
}

export function mergeAxisAlignedBoundingBoxes(boxes) {
    if (!boxes || boxes.length === 0) {
        return {
            min: [0, 0, 0],
            max: [0, 0, 0],
        };
    }

    if (boxes.length === 1) {
        return {
            min: vec3.clone(boxes[0].min),
            max: vec3.clone(boxes[0].max),
        };
    }

    const initial = {
        min: vec3.clone(boxes[0].min),
        max: vec3.clone(boxes[0].max),
    };

    return boxes.slice(1).reduce(({ min: amin, max: amax }, { min: bmin, max: bmax }) => {
        return {
            min: vec3.min(amin, amin, bmin),
            max: vec3.max(amax, amax, bmax),
        };
    }, initial);
}

