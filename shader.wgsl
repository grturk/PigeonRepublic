struct VertexInput {
    @location(0) position : vec3f,
    @location(1) texcoords : vec2f,
    @location(2) normal : vec3f,
}

struct VertexOutput {
    @builtin(position) clipPosition : vec4f,
    @location(0) position : vec3f,
    @location(1) texcoords : vec2f,
    @location(2) normal : vec3f,
}

struct FragmentInput {
    @location(0) position : vec3f,
    @location(1) texcoords : vec2f,
    @location(2) normal : vec3f,
}

struct FragmentOutput {
    @location(0) color : vec4f,
}

struct CameraUniforms {
    viewMatrix : mat4x4f,
    projectionMatrix : mat4x4f,
}

struct ModelUniforms {
    modelMatrix : mat4x4f,
    normalMatrix : mat3x3f,
}

struct MaterialUniforms {
    baseFactor : vec4f,
}

struct LightUniforms {
    position : vec3f,
    ambient : f32,
    lightViewProjMatrix : mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> camera : CameraUniforms;

@group(1) @binding(0) var<uniform> model : ModelUniforms;

@group(2) @binding(0) var<uniform> material : MaterialUniforms;
@group(2) @binding(1) var baseTexture : texture_2d<f32>;
@group(2) @binding(2) var baseSampler : sampler;

@group(3) @binding(0) var<uniform> light : LightUniforms;

@group(3) @binding(1) var shadowMap: texture_depth_2d;
@group(3) @binding(2) var shadowSampler: sampler_comparison;

@vertex
fn vertex(input : VertexInput) -> VertexOutput {
    var output : VertexOutput;

    output.clipPosition = camera.projectionMatrix * camera.viewMatrix * model.modelMatrix * vec4(input.position, 1);

    output.position = (model.modelMatrix * vec4(input.position, 1)).xyz;
    output.texcoords = input.texcoords;
    output.normal = model.normalMatrix * input.normal;

    return output;
}

@fragment
fn fragment(input : FragmentInput) -> FragmentOutput {
    var output : FragmentOutput;

    let N = normalize(input.normal);
    let L = normalize(light.position - input.position);

    let lambert = max(dot(N, L), 0);

    let materialColor = textureSample(baseTexture, baseSampler, input.texcoords) * material.baseFactor;
    let lambertFactor = vec4(vec3(lambert), 1);
    let ambientFactor = vec4(vec3(light.ambient), 1);

    
    var shadowCoord = light.lightViewProjMatrix * model.modelMatrix * vec4(input.position, 1.0);
    shadowCoord = shadowCoord / shadowCoord.w;
    shadowCoord.x = shadowCoord.x * 0.5 + 0.5; // Transform to [0, 1] range
    shadowCoord.y = shadowCoord.y * 0.5 + 0.5;
    let isShadowed = textureSampleCompare(shadowMap, shadowSampler, shadowCoord.xy, shadowCoord.z - 0.007);

    output.color = materialColor * (lambertFactor + ambientFactor) * (1.0 - isShadowed);

    return output;
}
