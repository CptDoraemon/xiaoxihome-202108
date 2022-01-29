import * as BABYLON from 'babylonjs';
import showWorldAxis from "./WorldAxis";
import * as MATERIAL from 'babylonjs-materials';
import initOceanShader from "./shaders/oceanShader";
import lowPolyWaterShader from "./shaders/lowPolyWaterShader";
import initAnimations from "./animations";
import initCameras from "./cameras";
import initEnvironment from "./environment";

const createScene = async function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);
  scene.actionManager = new BABYLON.ActionManager(scene);
  // showWorldAxis(1, scene);
  scene.debugLayer.show();

  await BABYLON.SceneLoader.AppendAsync(
    "/assets/imported/",
    "cn_tower_n_city_hall.babylon",
    scene
  );

  initEnvironment(scene);


  // low poly water
  const water = BABYLON.MeshBuilder.CreateGround("water", {width: 50, height: 50, subdivisions: 128}, scene);
  water.position = new BABYLON.Vector3(0, -0.3, 0);
  // water.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI * 0.5);
  lowPolyWaterShader();
  const waterMat = new BABYLON.ShaderMaterial(
    "waterMat",
    scene,
    {
      vertex: "lowPolyWater",
      fragment: "lowPolyWater",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "textureSampler", "color"],
    },
  );
  waterMat.setColor3('myColor', BABYLON.Color3.FromHexString('#74ccf4'));
  waterMat.setFloat('myStrength', 0.2);
  water.material = waterMat;
  // scene.forceWireframe = true;

  let time = 0.;
  scene.registerBeforeRender(function() {
    waterMat.setFloat("time", time);
    time += 1;
  });

  // cameras
  const allCameras = initCameras(scene);

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

  //render pipeline
  const pipeline = new BABYLON.DefaultRenderingPipeline(
    "defaultPipeline", // The name of the pipeline
    true, // Do you want the pipeline to use HDR texture?
    scene, // The scene instance
    allCameras // The list of cameras to be attached to
  );
  pipeline.imageProcessing.vignetteEnabled = true;
  pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0,0,0, 1);
  pipeline.imageProcessing.vignetteWeight = 10;
  pipeline.samples = 4;
  // pipeline.fxaaEnabled = true;
  pipeline.bloomEnabled = true;
  pipeline.bloomWeight = 0.1;
  pipeline.sharpenEnabled = true;
  pipeline.sharpen.edgeAmount = 0.2; // default 0.3
  pipeline.imageProcessing.contrast = 1; // default 1
  pipeline.imageProcessing.exposure = 1; // default 1

  return scene;
};

export default createScene
