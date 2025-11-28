precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform mat4 world;
uniform float time;

// Wave control uniforms
uniform float waveHeightMultiplier;     // Overall wave height scale (recommend: 0.5 - 2.0)
uniform float largeWaveHeight;          // Large ocean swells height (recommend: 0.15 - 0.35)
uniform float mediumWaveHeight;         // Medium waves height (recommend: 0.10 - 0.25)
uniform float smallWaveHeight;          // Small choppy waves height (recommend: 0.05 - 0.15)
uniform float noiseIntensity;           // Fine detail noise intensity (recommend: 0.1 - 0.3)
uniform float horizontalDisplacement;   // Horizontal wave displacement (recommend: 0.2 - 0.5)

// Varying
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;
varying float vWaveHeight;
varying float vDistanceFromCenter;

// Improved noise functions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion for more complex noise
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for(int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Gerstner wave function for more realistic ocean waves
vec3 gerstnerWave(vec2 pos, vec2 direction, float steepness, float wavelength, float speed, float t) {
    float k = 2.0 * 3.14159 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(direction);
    float f = k * (dot(d, pos) - c * speed * t);
    float a = steepness / k;

    return vec3(
        d.x * a * cos(f),
        a * sin(f),
        d.y * a * cos(f)
    );
}

void main(void) {
    vec3 p = position;
    vec2 pos = position.xz;

    // Calculate distance from center for edge damping
    vDistanceFromCenter = length(position.xz);

    // Multiple Gerstner waves with different directions and scales
    vec3 wave = vec3(0.0);

    // Large ocean swells (slow, long wavelength)
    wave += gerstnerWave(pos, vec2(1.0, 0.3), largeWaveHeight, 8.0, 0.6, time);
    wave += gerstnerWave(pos, vec2(-0.7, 1.0), largeWaveHeight * 0.8, 7.5, 0.55, time);

    // Medium waves (moderate speed and wavelength)
    wave += gerstnerWave(pos, vec2(0.8, -0.6), mediumWaveHeight, 4.0, 1.2, time);
    wave += gerstnerWave(pos, vec2(-0.5, -0.9), mediumWaveHeight * 1.2, 3.5, 1.1, time);
    wave += gerstnerWave(pos, vec2(0.9, 0.4), mediumWaveHeight * 0.8, 3.0, 1.3, time);

    // Small choppy waves (fast, short wavelength)
    wave += gerstnerWave(pos, vec2(0.6, 0.8), smallWaveHeight, 1.5, 2.0, time);
    wave += gerstnerWave(pos, vec2(-0.8, 0.2), smallWaveHeight * 1.25, 1.2, 2.2, time);
    wave += gerstnerWave(pos, vec2(0.3, -0.7), smallWaveHeight * 0.875, 1.0, 2.5, time);

    // Add fractal noise for fine detail and chaos
    float noiseValue = fbm(pos * 0.4 + vec2(time * 0.1, time * 0.15)) * 0.15 * noiseIntensity;
    noiseValue += fbm(pos * 1.2 + vec2(-time * 0.3, time * 0.25)) * 0.08 * noiseIntensity;
    noiseValue += fbm(pos * 2.5 + vec2(time * 0.5, -time * 0.4)) * 0.04 * noiseIntensity;

    // Combine waves with overall height multiplier
    float waveHeight = (wave.y + noiseValue) * waveHeightMultiplier;
    p.x += wave.x * horizontalDisplacement;
    p.z += wave.z * horizontalDisplacement;
    p.y += waveHeight;

    // Calculate normal using finite differences with multiple samples
    float offset = 0.15;

    // Sample heights around the point
    vec2 posX = vec2(position.x + offset, position.z);
    vec2 posZ = vec2(position.x, position.z + offset);

    vec3 waveX = gerstnerWave(posX, vec2(1.0, 0.3), largeWaveHeight, 8.0, 0.6, time);
    waveX += gerstnerWave(posX, vec2(-0.7, 1.0), largeWaveHeight * 0.8, 7.5, 0.55, time);
    waveX += gerstnerWave(posX, vec2(0.8, -0.6), mediumWaveHeight, 4.0, 1.2, time);
    waveX += gerstnerWave(posX, vec2(-0.5, -0.9), mediumWaveHeight * 1.2, 3.5, 1.1, time);

    vec3 waveZ = gerstnerWave(posZ, vec2(1.0, 0.3), largeWaveHeight, 8.0, 0.6, time);
    waveZ += gerstnerWave(posZ, vec2(-0.7, 1.0), largeWaveHeight * 0.8, 7.5, 0.55, time);
    waveZ += gerstnerWave(posZ, vec2(0.8, -0.6), mediumWaveHeight, 4.0, 1.2, time);
    waveZ += gerstnerWave(posZ, vec2(-0.5, -0.9), mediumWaveHeight * 1.2, 3.5, 1.1, time);

    float hX = (waveX.y + fbm(posX * 0.4 + vec2(time * 0.1, time * 0.15)) * 0.15 * noiseIntensity) * waveHeightMultiplier;
    float hZ = (waveZ.y + fbm(posZ * 0.4 + vec2(time * 0.1, time * 0.15)) * 0.15 * noiseIntensity) * waveHeightMultiplier;

    vec3 tangent = normalize(vec3(offset, hX - waveHeight, 0.0));
    vec3 bitangent = normalize(vec3(0.0, hZ - waveHeight, offset));
    vec3 calculatedNormal = normalize(cross(bitangent, tangent));

    // Transform to world space
    vec4 worldPos = world * vec4(p, 1.0);
    vPositionW = worldPos.xyz;
    vNormalW = normalize((world * vec4(calculatedNormal, 0.0)).xyz);
    vUV = uv;
    vWaveHeight = waveHeight;

    gl_Position = worldViewProjection * vec4(p, 1.0);
}