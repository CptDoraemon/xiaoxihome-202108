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
    float id = float(gl_VertexID);
    p.y = p.y + random(vec2(time, gl_VertexID)) * myStrength;
    
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
    float ToonThresholds[4];
    ToonThresholds[0] = 0.95;
    ToonThresholds[1] = 0.5;
    ToonThresholds[2] = 0.2;
    ToonThresholds[3] = 0.03;
    
    float ToonBrightnessLevels[5];
    ToonBrightnessLevels[0] = 1.0;
    ToonBrightnessLevels[1] = 0.8;
    ToonBrightnessLevels[2] = 0.6;
    ToonBrightnessLevels[3] = 0.35;
    ToonBrightnessLevels[4] = 0.2;
    
    vec3 vLightPosition = vec3(-1, 1, 2);
    
    // Light
    vec3 lightVectorW = normalize(vLightPosition - vPositionW);
    
    // diffuse
    float ndl = max(0., dot(vNormalW, lightVectorW));
    
    vec3 color = myColor;
    
    if (ndl > ToonThresholds[0])
    {
        color *= ToonBrightnessLevels[0];
    }
    else if (ndl > ToonThresholds[1])
    {
        color *= ToonBrightnessLevels[1];
    }
    else if (ndl > ToonThresholds[2])
    {
        color *= ToonBrightnessLevels[2];
    }
    else if (ndl > ToonThresholds[3])
    {
        color *= ToonBrightnessLevels[3];
    }
    else
    {
        color *= ToonBrightnessLevels[4];
    }
    
    gl_FragColor = vec4(color, 1.);
}
  `;
}

export default lowPolyWaterShader
