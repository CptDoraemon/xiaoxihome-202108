import * as BABYLON from 'babylonjs';
import initAnimations from "./animations";
import initCameras from "./cameras";
import initEnvironment from "./environment";

import waterVertexShader from './shaders/water.vertex.glsl';
import waterFragmentShader from './shaders/water.fragment.glsl';

const createScene = async function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);
  // scene.actionManager = new BABYLON.ActionManager(scene);
  // showWorldAxis(1, scene);
  // scene.debugLayer.show();

  await BABYLON.SceneLoader.AppendAsync(
    "/assets/imported/",
    "cn_tower_n_city_hall.babylon",
    scene
  );

  await initEnvironment(scene);

  // cameras
  const {
    allCameras,
    switchCamera
  } = initCameras(scene);

  // animations
  initAnimations(scene);

  // volumetric light
  const sunMesh = BABYLON.Mesh.CreatePlane("sunMesh", 3, scene);
  const sunMeshMaterial = new BABYLON.StandardMaterial('sunSourceMaterial', scene);
  sunMeshMaterial.emissiveColor = BABYLON.Color3.FromHexString('#fbe9e7');
  //@ts-ignore
  sunMeshMaterial.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  sunMeshMaterial.diffuseTexture = new BABYLON.Texture("/assets/sun.png", scene);
  sunMeshMaterial.diffuseTexture.hasAlpha = true;
  sunMesh.material = sunMeshMaterial;
  sunMesh.position = new BABYLON.Vector3(-10, 0.5, 100);
  // const vls = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1, allCameras[0], sunMesh, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
  // vls.useDiffuseColor = true;
  // vls.exposure = 0.8;
  // vls.samples = 4;

  // add water
  const {shaderMaterial: waterMaterial} = addWater(scene, sunMesh.position)

  //render pipeline
  const pipeline = new BABYLON.DefaultRenderingPipeline(
    "defaultPipeline", // The name of the pipeline
    true, // Do you want the pipeline to use HDR texture?
    scene, // The scene instance
    allCameras // The list of cameras to be attached to
  );
  pipeline.imageProcessing.vignetteEnabled = true;
  pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0,0,0, 0.6);
  pipeline.imageProcessing.vignetteWeight = 5;
  pipeline.samples = 4;
  // pipeline.fxaaEnabled = true;
  // pipeline.bloomEnabled = true;
  // pipeline.bloomWeight = 0.1;
  pipeline.sharpenEnabled = true;
  pipeline.sharpen.edgeAmount = 0.2; // default 0.3
  pipeline.imageProcessing.contrast = 1; // default 1
  pipeline.imageProcessing.exposure = 1; // default 1

  scene.registerBeforeRender(() => {
    const time = performance.now() * 0.0005;
    waterMaterial.setFloat("time", time);
  });

  return {
    scene,
    callbacks: {
      switchCamera
    }
  };
};

function addWater(scene: BABYLON.Scene, moonPosition: BABYLON.Vector3) : {mesh: BABYLON.Mesh, shaderMaterial: BABYLON.ShaderMaterial} {
  // add water plane
  BABYLON.Effect.ShadersStore["waterVertexShader"] = waterVertexShader as string;
  BABYLON.Effect.ShadersStore["waterFragmentShader"] = waterFragmentShader as string;

  const waterMaterial = new BABYLON.ShaderMaterial(
    "waterShader",
    scene,
    {
      vertex: "water",
      fragment: "water",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldViewProjection", "time", "cameraPosition"]
    }
  );

  const waterPlane = BABYLON.MeshBuilder.CreateGround(
    "water",
    { width: 100, height: 100, subdivisions: 120 },
    scene
  );
  waterPlane.position.y = -0.3;

  waterMaterial.setVector3("lightPosition", moonPosition);
  waterMaterial.setVector3("lightColor", new BABYLON.Vector3(0.9, 0.95, 1.0));
  waterMaterial.setVector3("waterColor", new BABYLON.Vector3(0.1, 0.5, 0.7));
  waterMaterial.setVector3("deepWaterColor", new BABYLON.Vector3(0.0, 0.2, 0.4));
  waterMaterial.setVector3("horizonColor", new BABYLON.Vector3(0.15, 0.2, 0.35));
  waterMaterial.setVector3("moonPosition", moonPosition);
  waterMaterial.setFloat("fogDensity", 0.012);
  waterMaterial.setFloat("fogStart", 0.0);
  waterMaterial.backFaceCulling = false;
  waterMaterial.alpha = 0.85;
  waterMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
  waterMaterial.needDepthPrePass = true;

  waterMaterial.setFloat("waveHeightMultiplier", 0.3);      // Overall scale
  waterMaterial.setFloat("largeWaveHeight", 0.25);          // Large swells
  waterMaterial.setFloat("mediumWaveHeight", 0.15);         // Medium waves
  waterMaterial.setFloat("smallWaveHeight", 0.08);          // Small choppy waves
  waterMaterial.setFloat("noiseIntensity", 1.0);            // Fine detail
  waterMaterial.setFloat("horizontalDisplacement", 0.01);    // Horizontal movement

  waterPlane.material = waterMaterial;

  return {
    mesh: waterPlane,
    shaderMaterial: waterMaterial
  };
}

export default createScene
