const lowPolyWaterShader = () => {
  BABYLON.Effect.ShadersStore["lowPolyWaterVertexShader"] = `
precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 world;
uniform mat4 worldViewProjection;
uniform float time;

// Varying
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;

float random(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main() {
    vec3 p = position;
    float bn = p.x;
    p.y = p.y + random(vec2(floor(time / 1.0), gl_VertexID));
    
    vPositionW = vec3(world * vec4(position, 1.0));
    vNormalW = normalize(vec3(world * vec4(normal, 0.0)));
    vUV = uv;

    gl_Position = worldViewProjection * vec4(p, 1.0);
}
  `;

  BABYLON.Effect.ShadersStore["lowPolyWaterFragmentShader"] = `
precision highp float;

// Lights
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;

// Refs
uniform vec3 myColor;

void main(void) {
    gl_FragColor = vec4(myColor, 1.);
}
  `;
}

export default lowPolyWaterShader
