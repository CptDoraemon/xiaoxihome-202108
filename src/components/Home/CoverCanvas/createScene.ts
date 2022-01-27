import * as BABYLON from 'babylonjs';
import showWorldAxis from "./WorldAxis";
import * as MATERIAL from 'babylonjs-materials';
import initOceanShader from "./shaders/oceanShader";
import lowPolyWaterShader from "./shaders/lowPolyWaterShader";
import initAnimations from "./animations";
import initCameras from "./cameras";

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

  //sky
  // const skyBox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
  // const skyMaterial = new MATERIAL.SkyMaterial('sky', scene);
  // skyMaterial.backFaceCulling = false;
  // skyMaterial.luminance = 1; // Controls the overall luminance of sky in interval ]0, 1,190[
  // skyMaterial.turbidity = 1; // Represents the amount (scattering) of haze as opposed to molecules in atmosphere
  // // skyMaterial.inclination = 0.4; // The solar inclination, related to the solar azimuth in interval [0, 1]
  // // skyMaterial.azimuth = 0.2; // The solar azimuth in interval [0, 1]
  // skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
  // skyMaterial.sunPosition = new BABYLON.Vector3(-10, 5, 100);
  // skyBox.material = skyMaterial;

  // lights
  // const light = new BABYLON.DirectionalLight('Sun', new BABYLON.Vector3(0, -2, 0), scene);
  // light.intensity = 1;

  const hl = new BABYLON.HemisphericLight('Hl',new BABYLON.Vector3(0,1,0),scene);
  hl.intensity = 1;

  // importedLights

  // const envLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 5, 0), scene);
  // envLight.intensity = 0.5;
  //
  // const light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, 0), scene);
  // light.diffuse = new BABYLON.Color3(0.8, 0.7, 0.7);
  // light.specular = new BABYLON.Color3(0.8, 0.8, 1);
  // light.position = new BABYLON.Vector3(0, 40, 0);
  // light.intensity = 0.5;

  // const shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
  // shadowGenerator.useBlurExponentialShadowMap = true;
  // shadowGenerator.addShadowCaster(sphere1.mesh);
  // shadowGenerator.addShadowCaster(sphere2.mesh);

  // low poly water
  const water = BABYLON.MeshBuilder.CreateGround("water", {width: 20, height: 20, subdivisions: 32}, scene);
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

  return scene;
};

export default createScene
