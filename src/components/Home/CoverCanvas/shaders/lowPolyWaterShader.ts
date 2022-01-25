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
uniform float myStrength;

// Varying
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;

float getRandom(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

float PI = radians(180.0);

void main() {
    vec3 p = position;
    float id = float(gl_VertexID);
    float tick = time / 60.0;
    float random = getRandom(vec2(floor(tick/PI), gl_VertexID)); // fixed for vertexID, changes when sin() == 0
    p.y = p.y + sin(tick) * random * myStrength;
    
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
    vec3 vLightPosition = vec3(-2, 1, 12);
    
    // Light
    vec3 lightVectorW = normalize(vLightPosition - vPositionW);
    
    // diffuse
    float ndl = max(0., dot(vNormalW, lightVectorW));
    
    vec3 color = myColor * ndl;
    
    gl_FragColor = vec4(color, 1.);
}
  `;
}

export default lowPolyWaterShader
