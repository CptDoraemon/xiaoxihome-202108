precision highp float;

// Varying
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;
varying float vWaveHeight;
varying float vDistanceFromCenter;

// Uniforms
uniform vec3 cameraPosition;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 waterColor;
uniform vec3 deepWaterColor;
uniform vec3 horizonColor;
uniform vec3 moonPosition;
uniform float time;
uniform float fogDensity;
uniform float fogStart;

void main(void) {
    // Normalize interpolated normal
    vec3 normal = normalize(vNormalW);

    // View direction
    vec3 viewDir = normalize(cameraPosition - vPositionW);

    // Distance from camera for fog
    float distanceFromCamera = length(cameraPosition - vPositionW);

    // Light direction (moonlight)
    vec3 lightDir = normalize(lightPosition - vPositionW);

    // Fresnel effect (stronger reflection at grazing angles)
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

    // Calculate reflection vector
    vec3 reflectDir = reflect(-viewDir, normal);

    // Moon reflection
    vec3 moonDir = normalize(moonPosition - vPositionW);
    vec3 moonReflectDir = reflect(-moonDir, normal);
    float moonReflection = max(dot(viewDir, -moonReflectDir), 0.0);
    moonReflection = pow(moonReflection, 128.0); // Sharp moon reflection

    // Add moon path on water (wider reflection path)
    float moonPathReflection = max(dot(viewDir, -moonReflectDir), 0.0);
    moonPathReflection = pow(moonPathReflection, 32.0) * 0.6;

    // Combine moon reflections
    vec3 moonColor = vec3(1.0, 0.98, 0.9) * (moonReflection * 2.0 + moonPathReflection);

    // Night sky reflection
    vec3 skyColor = vec3(0.15, 0.2, 0.35);
    float skyReflection = max(dot(reflectDir, vec3(0.0, 1.0, 0.0)), 0.0);
    vec3 reflectionColor = mix(skyColor * 0.3, skyColor, skyReflection);

    // Diffuse lighting from moon
    float diffuse = max(dot(normal, lightDir), 0.0);

    // Specular highlight from moon
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 64.0);

    // Water depth color mixing (darker for night)
    vec3 nightWaterColor = waterColor * 0.5;
    vec3 nightDeepWaterColor = deepWaterColor * 0.3;
    vec3 baseWaterColor = mix(nightDeepWaterColor, nightWaterColor, clamp(vWaveHeight + 0.5, 0.0, 1.0));

    // Wave height normalized (0 to 1, where 1 is peak)
    float waveIntensity = clamp((vWaveHeight + 0.8) / 1.6, 0.0, 1.0);

    // Stronger reflection at wave peaks
    float reflectionStrength = fresnel * (0.5 + waveIntensity * 0.5);

    // Combine all lighting components
    vec3 ambient = baseWaterColor * 0.2;
    vec3 diffuseColor = baseWaterColor * diffuse * lightColor * 0.8;
    vec3 specularColor = lightColor * specular * 0.6;

    // Mix water color with reflection
    vec3 finalColor = mix(ambient + diffuseColor, reflectionColor, reflectionStrength);
    finalColor += specularColor;

    // Add moon reflection to water
    finalColor += moonColor;

    // Add some sparkle at wave peaks
    float sparkle = pow(waveIntensity, 4.0) * specular;
    finalColor += vec3(sparkle) * 0.3;

    // Calculate exponential fog
    float fogAmount = 1.0 - exp(-fogDensity * max(distanceFromCamera - fogStart, 0.0));
    fogAmount = clamp(fogAmount, 0.0, 1.0);

    // Blend with horizon color (atmospheric perspective)
    finalColor = mix(finalColor, horizonColor, fogAmount);

    // Fade alpha at edges for seamless blending
    float edgeFade = smoothstep(45.0, 50.0, vDistanceFromCenter);
    float finalAlpha = mix(0.85, 0.0, edgeFade);

    gl_FragColor = vec4(finalColor, finalAlpha);
}