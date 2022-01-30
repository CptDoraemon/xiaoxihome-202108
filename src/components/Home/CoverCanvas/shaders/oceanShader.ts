import * as BABYLON from 'babylonjs';

import common from "./chunks/common.glsl";
import fog_pars_vertex from "./chunks/fog_pars_vertex.glsl";
import shadowmap_pars_vertex from "./chunks/shadowmap_pars_vertex.glsl";
import logdepthbuf_pars_vertex from "./chunks/logdepthbuf_pars_vertex.glsl";
import beginnormal_vertex from "./chunks/beginnormal_vertex.glsl";
import defaultnormal_vertex from "./chunks/defaultnormal_vertex.glsl";
import logdepthbuf_vertex from "./chunks/logdepthbuf_vertex.glsl";
import fog_vertex from "./chunks/fog_vertex.glsl";
import shadowmap_vertex from "./chunks/shadowmap_vertex.glsl";

import packing from "./chunks/packing.glsl";
import bsdfs from "./chunks/bsdfs.glsl";
import fog_pars_fragment from "./chunks/fog_pars_fragment.glsl";
import logdepthbuf_pars_fragment from "./chunks/logdepthbuf_pars_fragment.glsl";
import lights_pars_begin from "./chunks/lights_pars_begin.glsl";
import shadowmap_pars_fragment from "./chunks/shadowmap_pars_fragment.glsl";
import shadowmask_pars_fragment from "./chunks/shadowmask_pars_fragment.glsl";

import logdepthbuf_fragment from "./chunks/logdepthbuf_fragment.glsl";

import tonemapping_fragment from "./chunks/tonemapping_fragment.glsl";
import fog_fragment from "./chunks/fog_fragment.glsl";

const initOceanShader = () => {
  BABYLON.Effect.IncludesShadersStore["common"] = common;
  BABYLON.Effect.IncludesShadersStore["fog_pars_vertex"] = fog_pars_vertex;
  BABYLON.Effect.IncludesShadersStore["shadowmap_pars_vertex"] = shadowmap_pars_vertex;
  BABYLON.Effect.IncludesShadersStore["logdepthbuf_pars_vertex"] = logdepthbuf_pars_vertex;
  BABYLON.Effect.IncludesShadersStore["beginnormal_vertex"] = beginnormal_vertex;
  BABYLON.Effect.IncludesShadersStore["defaultnormal_vertex"] = defaultnormal_vertex;
  BABYLON.Effect.IncludesShadersStore["logdepthbuf_vertex"] = logdepthbuf_vertex;
  BABYLON.Effect.IncludesShadersStore["fog_vertex"] = fog_vertex;
  BABYLON.Effect.IncludesShadersStore["shadowmap_vertex"] = shadowmap_vertex;

  BABYLON.Effect.IncludesShadersStore["packing"] = packing;
  BABYLON.Effect.IncludesShadersStore["bsdfs"] = bsdfs;
  BABYLON.Effect.IncludesShadersStore["fog_pars_fragment"] = fog_pars_fragment;
  BABYLON.Effect.IncludesShadersStore["logdepthbuf_pars_fragment"] = logdepthbuf_pars_fragment;
  BABYLON.Effect.IncludesShadersStore["lights_pars_begin"] = lights_pars_begin;
  BABYLON.Effect.IncludesShadersStore["shadowmap_pars_fragment"] = shadowmap_pars_fragment;
  BABYLON.Effect.IncludesShadersStore["shadowmask_pars_fragment"] = shadowmask_pars_fragment;

  BABYLON.Effect.IncludesShadersStore["logdepthbuf_fragment"] = logdepthbuf_fragment;

  BABYLON.Effect.IncludesShadersStore["tonemapping_fragment"] = tonemapping_fragment;
  BABYLON.Effect.IncludesShadersStore["fog_fragment"] = fog_fragment;


  BABYLON.Effect.ShadersStore["oceanVertexShader"]= `
				uniform mat4 textureMatrix;
				uniform float time;
				varying vec4 mirrorCoord;
				varying vec4 worldPosition;
				#include<common>
				#include<fog_pars_vertex>
				#include<shadowmap_pars_vertex>
				#include<logdepthbuf_pars_vertex>
				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;
				#include<beginnormal_vertex>
				#include<defaultnormal_vertex>
				#include<logdepthbuf_vertex>
				#include<fog_vertex>
				#include<shadowmap_vertex>
			}`;

  BABYLON.Effect.ShadersStore["oceanFragmentShader"]= `
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;
				varying vec4 mirrorCoord;
				varying vec4 worldPosition;
				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}
				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}
				#include<common>
				#include<packing>
				#include<bsdfs>
				#include<fog_pars_fragment>
				#include<logdepthbuf_pars_fragment>
				#include<lights_pars_begin>
				#include<shadowmap_pars_fragment>
				#include<shadowmask_pars_fragment>
				void main() {
					#include<logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );
					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);
					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );
					float distance = length(worldToEye);
					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );
					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );
					#include<tonemapping_fragment>
					#include<fog_fragment>
				}`;
}

export default initOceanShader
